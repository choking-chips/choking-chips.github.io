let bgInfo, var_qty;
let dir = [0, 0]; // direction, 交换方向；0为横向方向，1为纵向方向

function iconOnPointerDown(event) {
    this.onpointermove = function (eventMove) {
        const tms = 0.2; // times
        const minMov = 6; // 最小偏移量，阈值
        const pointerMov = [eventMove.clientX - event.clientX, eventMove.clientY - event.clientY]; // 指针的相对移动量
        const thisNumId = parseInt(this.id.substring(4)); // 本icon的数字id
        // 跟随鼠标，但又没有完全跟随；且能切换格子
        const iconMov = calcIconMov(pointerMov, 1.6);
        iconTransform(this, dir[0] * (50 - minMov) + iconMov[0], dir[1] * (50 - minMov) + iconMov[1]);
        if (dir[0] || dir[1]) { // 已有待交换的icon
            if (dir[0] && Math.abs(tms * pointerMov[0]) < minMov || dir[1] && Math.abs(tms * pointerMov[1]) < minMov) { // 锁死已偏移的方向，除非缩回限定的偏移量内
                document.getElementById('icon' + calcTBEIconNumId(thisNumId)).style.transform = null;
                dir = [0, 0];
            }
        } else { // 尚没有待交换的icon
            for (let i = 0; i < 2; i++) { // 横向纵向都检查一遍
                if (Math.abs(tms * pointerMov[i]) >= minMov) { // 当一个方向偏移量足够大时
                    dir[i] = pointerMov[i] > 0 ? 1 : -1; // 确定方向
                    if (isTBEIconValid(thisNumId)) { // 判断有无越界问题
                        iconTransform(calcTBEIconNumId(thisNumId), -dir[0] * 50, -dir[1] * 50); // 移动待交换icon
                        // 本icon的transform需再刷新一次，因为指针要是在这时不动，就没法移到新格子了
                        iconTransform(this, dir[0] * (50 - minMov) + iconMov[0], dir[1] * (50 - minMov) + iconMov[1]);
                        break;
                    } else { // 有问题，这个dir不能要
                        dir[i] = 0;
                    }
                }
            }
        }
    }
    // 上面都是指针移动的监听器

    this.style.fontSize = '44px';
    this.style.top = '2px';
    this.style.left = '2px';
    this.setPointerCapture(event.pointerId); // 开始捕捉指针
}

function iconOnPointerUp(event) {
    this.onpointermove = null;
    this.style.fontSize = null;
    this.style.top = null;
    this.style.left = null;
    this.releasePointerCapture(event.pointerId);
    if (dir[0] || dir[1]) { // 需要交换
        iconTransform(this, dir[0] * 50, dir[1] * 50) // 用动画将此icon归新位
        setTimeout(exchange, 100, this); // 延时执行交换逻辑，为了动画能正常播放
    } else { // 没有换过
        this.style.transform = null;
    }
}

function calcIconMov(pointerMov, base) {
    base = base ? base : 2;
    let iconMov = [];
    for (let i = 0; i < 2; i++) {
        let offset = pointerMov[i] - 50 * dir[i];
        iconMov[i] = (offset >= 0 ? Math.log(offset + 1) : -Math.log(-offset + 1)) / Math.log(base);
    }
    return iconMov;
}

function calcTBEIconNumId(thisNumId) {
    return dir[0] ? thisNumId + dir[0] : thisNumId + dir[1] * bgInfo[0];
}

function isTBEIconValid(thisNumId) {
    let valid = true;
    const thisInfo = [(thisNumId - 1) % bgInfo[0] + 1, Math.floor((thisNumId - 1) / bgInfo[0]) + 1];
    for (let i = 0; i < 2; i++) {
        valid = valid && !(thisInfo[i] == 1 && dir[i] < 0 || thisInfo[i] == bgInfo[i] && dir[i] > 0);
    }
    if (valid) {
        // to be continued
    }
    return valid;
}

function exchange(thisIcon) {
    // 老id读取 & 新数字id记录
    exchIconNewNumId = parseInt(thisIcon.id.substring(4)); // 代表this的老数字id
    thisNewNumId = calcTBEIconNumId(exchIconNewNumId) // 代表exchIcon的老数字id
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

function iconTransform(icon, tX, tY) { // 对给予的icon修改transform样式
    if (!isNaN(icon)) {
        icon = document.getElementById('icon' + icon);
    }
    icon.style.transform = `translate(${tX}px, ${tY}px)`;
}

function apply() {
    let widthInput = document.getElementById('width'), heightInput = document.getElementById('height');
    if (widthInput.value >= 5 && heightInput.value >= 5) {
        document.getElementById('main').innerHTML = ''; // 清空原棋盘
        bgInfo = [parseInt(widthInput.value), parseInt(heightInput.value)];
        bgInfo[2] = bgInfo[0] * bgInfo[1];
        var_qty = parseInt(document.getElementById('var_qty').value);
        placeBlocks();
        placeIcons(var_qty);

        document.getElementById('apply').innerHTML = '应用并重置';
    }
    
}

function placeBlocks() {
    for (let i = 0; i < bgInfo[1]; i++) {
        // 外循环，执行一次即创建一个新行
        let newRow = document.createElement('div');  // 一个新行
        newRow.className = 'row';
        for (let j = 1; j <= bgInfo[0]; j++) {
            // 内循环，执行一次将一个块加入
            let newBlock = document.createElement('span'); // 一个新块
            newBlock.id = 'block' + (i * bgInfo[0] + j).toString(); // 添加id
            newBlock.className = 'block'; // 添加默认的类名
            newRow.append(newBlock); // 将块添加到行中
        }
        document.getElementById('main').append(newRow); // 将行添加到游戏区域中
    }
}

function placeIcons() {
    var_qty = 3;
    let icons = ['info', 'warning', 'error'];
    let colors = ['skyblue', 'orange', 'red'];
    for (let i = 1; i <= bgInfo[2]; i++) {
        if (document.getElementById('icon' + i)) { // 应对回到前面重新生成的情况
            document.getElementById('icon' + i).remove(); // 如果有内容了，就删掉
        }
        let icon = document.createElement('span');
        icon.id = 'icon' + i;
        icon.className = 'icon mdi';
        let rnd = Math.floor(Math.random() * var_qty);
        icon.innerHTML = icons[rnd];
        if ((i - 1) % bgInfo[0] + 1 >= 3) { // 从一行的第三个开始，判断它能否进行横向消除
            let iconOTL = document.getElementById('icon' + (i - 1)); // icon on the left
            let iconOTLL = document.getElementById('icon' + (i - 2));
            if (icon.innerHTML == iconOTL.innerHTML && icon.innerHTML == iconOTLL.innerHTML) {
                i -= 3; // 回到前面重新生成
                continue;
            }
        }
        if (Math.floor((i - 1) / bgInfo[0]) + 1 >= 3) { // 从第三行开始，判断它能否进行竖向消除
            let iconA = document.getElementById('icon' + (i - bgInfo[0])); // icon above
            let iconAA = document.getElementById('icon' + (i - 2 * bgInfo[0]));
            if (icon.innerHTML == iconA.innerHTML && icon.innerHTML == iconAA.innerHTML) {
                i--; // 重新生成此块
                continue;
            }
        }
        icon.style.color = colors[rnd]; // 设定颜色
        document.getElementById('block' + i).append(icon); // 加入块中
        icon.onpointerdown = iconOnPointerDown;
        icon.onpointerup = iconOnPointerUp;
    }
}
