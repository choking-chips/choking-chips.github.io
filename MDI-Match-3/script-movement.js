let dir = [0, 0]; // direction, 交换方向；0为横向方向，1为纵向方向

function iconOnPointerDown(eventDown) {
    const thisIcon = new Icon(getNumIdByObj(this));
    this.onpointermove = function (eventMove) {
        const pointerMov = [eventMove.clientX - eventDown.clientX, eventMove.clientY - eventDown.clientY]; // 指针的相对移动量
        // 跟随鼠标，但又没有完全跟随；且能切换格子
        const iconMov = calcIconMov(thisIcon, pointerMov, 1.8);
        setIconTransform(thisIcon, iconMov[0], iconMov[1]);
    }
    // 设置样式以营造出正在被拖动的效果
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
    // 以上将设定的样式还原
    let thisIcon = new Icon(getNumIdByObj(this));
    let targetIcon = calcTargetIcon(thisIcon);
    if (dir[0] || dir[1]) { // 交换了
        exchangeIds(thisIcon, targetIcon); // 先交换一下id
        if (judge([thisIcon, targetIcon])) { // 判断交换后是否可以连起来
            setIconTransform(thisIcon, dir[0] * 50, dir[1] * 50) // 用动画将thisIcon归新位
            setTimeout(exchangeLocations, 100, thisIcon, targetIcon); // 延时执行交换逻辑，为了动画能正常播放
            setTimeout(fall, 500); // 下落
        } else { // 连不起来
            exchangeIds(thisIcon, targetIcon); // 交换回来
            this.style.transform = null;
            setIconTransform(targetIcon, 0, 0);
            dir = [0, 0];
        }
    } else { // 没有换过
        setIconTransform(thisIcon, 0, 0);
    }
}

function calcIconMov(thisIcon, pointerMov, base) { // 根据指针移动量计算图标移动量，使用对数函数，默认基底为2
    base = base ? base : 2;
    let iconMov = [];
    const minMov = 30; // 最小偏移量，阈值
    // 先计算dir
    if (!dir[0] && !dir[1]) { // 尚没有待交换的icon
        for (let i = 0; i < 2; i++) { // 横向纵向都检查一遍
            if (Math.abs(pointerMov[i]) >= minMov) { // 当一个方向偏移量足够大时
                dir[i] = pointerMov[i] > 0 ? 1 : -1; // 确定方向
                if (isTargetIconValid(thisIcon)) { // 判断有无越界
                    setIconTransform(calcTargetIcon(thisIcon), -dir[0] * 50, -dir[1] * 50); // 移动待交换icon
                    break;
                } else { // 有问题，这个dir不能要
                    dir[i] = 0;
                }
            }
        }
    } else { // 已有待交换的icon
        for (let i = 0; i < 2; i++) { // 横向纵向都检查一遍
            if (dir[i] && dir[i] * pointerMov[i] < minMov) { // 锁死已偏移的方向，除非缩回限定的偏移量内
                setIconTransform(calcTargetIcon(thisIcon), 0, 0);
                dir[i] = 0;
                break;
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

function calcTargetIcon(thisIcon) { // 根据鼠标移动相对值推测将要交换的icon的数字id
    return new Icon(dir[0] ? thisIcon.numId + dir[0] : thisIcon.numId + dir[1] * w);
}

function isTargetIconValid(thisIcon) { // 检查待交换的icon是否合理
    let valid = true;
    const wh = [w, h];
    const thisIconPos = [(thisIcon.numId - 1) % w + 1, Math.floor((thisIcon.numId - 1) / w) + 1]; // 此icon的位置
    for (let i = 0; i < 2; i++) { // 检查在首位的行列有没有往棋盘外移动
        valid = valid && !(thisIconPos[i] == 1 && dir[i] < 0 || thisIconPos[i] == (wh[i]) && dir[i] > 0);
    }
    return valid;
}