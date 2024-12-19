let dir = [0, 0]; // direction, 交换方向；0为横向方向，1为纵向方向

function iconOnPointerDown(eventDown) {
    this.onpointermove = function (eventMove) {
        const pointerMov = [eventMove.clientX - eventDown.clientX, eventMove.clientY - eventDown.clientY]; // 指针的相对移动量
        // 跟随鼠标，但又没有完全跟随；且能切换格子
        const iconMov = calcIconMov(this, pointerMov, 1.8);
        setIconTransform(this, iconMov[0], iconMov[1]);
    }
    this.style.fontSize = '44px';
    this.style.top = '2px';
    this.style.left = '2px';
    this.setPointerCapture(eventDown.pointerId); // 开始捕捉指针
}

function iconOnPointerUp(event) {
    this.onpointermove = null;
    this.style.fontSize = null;
    this.style.top = null;
    this.style.left = null;
    this.releasePointerCapture(event.pointerId);
    if (dir[0] || dir[1]) { // 需要交换
        setIconTransform(this, dir[0] * 50, dir[1] * 50) // 用动画将此icon归新位
        setTimeout(exchange, 100, this); // 延时执行交换逻辑，为了动画能正常播放
    } else { // 没有换过
        this.style.transform = null;
    }
}

function exchange(thisIcon) {
    // 老id读取 & 新数字id记录
    exchIconNewNumId = parseInt(thisIcon.id.substring(4)); // 代表this交换前的数字id
    thisNewNumId = calcTBEIconNumId(exchIconNewNumId) // 代表exchIcon交换前的数字id
    exchIcon = document.getElementById('icon' + thisNewNumId);

    // 先从父元素移除
    thisIcon.remove();
    exchIcon.remove();

    // 加入到新的对应父元素
    document.getElementById('block' + thisNewNumId).append(thisIcon);
    document.getElementById('block' + exchIconNewNumId).append(exchIcon);

    // 互换id
    thisIcon.id = 'icon' + thisNewNumId;
    exchIcon.id = 'icon' + exchIconNewNumId;

    // 恢复一些参数到默认
    thisIcon.style.transform = null;
    exchIcon.style.transform = null;
    exchIcon = null;
    dir = [0, 0];

    // 开始判断是否能消除

}

function calcIconMov(thisIcon, pointerMov, base) { // 根据指针移动量计算图标移动量，使用对数函数，默认基底为2
    base = base ? base : 2;
    let iconMov = [];
    const thisNumId = parseInt(thisIcon.id.substring(4)); // 本icon的数字id
    const minMov = 30; // 最小偏移量，阈值
    // 先计算dir
    if (dir[0] || dir[1]) { // 已有待交换的icon
        for (let i = 0; i < 2; i++) { // 横向纵向都检查一遍
            if (dir[i] && dir[i] * pointerMov[i] < minMov) { // 锁死已偏移的方向，除非缩回限定的偏移量内
                setIconTransform(calcTBEIconNumId(thisNumId), 0, 0);
                dir[i] = 0;
                break;
            }
        }
    } else { // 尚没有待交换的icon
        for (let i = 0; i < 2; i++) { // 横向纵向都检查一遍
            if (Math.abs(pointerMov[i]) >= minMov) { // 当一个方向偏移量足够大时
                dir[i] = pointerMov[i] > 0 ? 1 : -1; // 确定方向
                if (isTBEIconValid(thisNumId)) { // 判断有无越界问题
                    setIconTransform(calcTBEIconNumId(thisNumId), -dir[0] * 50, -dir[1] * 50); // 移动待交换icon
                    break;
                } else { // 有问题，这个dir不能要
                    dir[i] = 0;
                }
            }
        }
    }
    // 再计算iconMov
    for (let i = 0; i < 2; i++) {
        const x = pointerMov[i] - dir[i] * 50; // 指针与方块中心的相对位置
        iconMov[i] = (x > 0 ? Math.log(x + 1) : -Math.log(-x + 1)) / Math.log(base) + dir[i] * 50;
    }
    return iconMov;
}

function calcTBEIconNumId(thisNumId) { // 根据鼠标移动相对值推测将要交换的icon的数字id
    return dir[0] ? thisNumId + dir[0] : thisNumId + dir[1] * bgInfo[0];
}

function isTBEIconValid(thisNumId) { // 检查待交换的icon是否合理
    let valid = true;
    const thisInfo = [(thisNumId - 1) % bgInfo[0] + 1, Math.floor((thisNumId - 1) / bgInfo[0]) + 1]; // 此icon的位置
    for (let i = 0; i < 2; i++) { // 检查在首位的行列有没有往棋盘外移动
        valid = valid && !(thisInfo[i] == 1 && dir[i] < 0 || thisInfo[i] == bgInfo[i] && dir[i] > 0);
    }
    if (valid) {
        // to be continued
    }
    return valid;
}

function setIconTransform(icon, tX, tY) { // 对给予的icon修改transform样式
    if (!isNaN(icon)) { // 同时接受以'icon'开头的字符串或者纯数字
        icon = document.getElementById('icon' + icon); // 而纯数字需要先在开头加上'icon'
    }
    icon.style.transform = (tX == 0 && tY == 0) ? null : `translate(${tX}px, ${tY}px)`;
}
