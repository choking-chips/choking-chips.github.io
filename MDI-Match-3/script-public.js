// 函数
function getIconByNumId(numId) {
    return document.getElementById('icon' + numId);
}

function getNumIdByObj(icon) {
    return parseInt(icon.id.substring(4));
}

function getBlockByNumId(numId) {
    return document.getElementById('block' + numId);
}

function spawnIcon(blockNumId, needValid) {
    let icons = ['info', 'warning', 'error'];
    let colors = ['skyblue', 'orange', 'red'];
    let icon = document.createElement('span');
    icon.id = 'icon' + blockNumId;
    icon.style.opacity = '0'; // 先隐藏
    icon.className = 'icon mdi';
    let rnd = Math.floor(Math.random() * var_qty);
    icon.innerHTML = icons[rnd];
    if (needValid) {
        if ((blockNumId - 1) % w + 1 >= 3) { // 从一行的第三个开始，判断它能否进行横向消除
            let iconOTL = getIconByNumId(blockNumId - 1); // icon on the left
            let iconOTLL = getIconByNumId(blockNumId - 2);
            if (icon.innerHTML == iconOTL.innerHTML && icon.innerHTML == iconOTLL.innerHTML) {
                return 1; // 返回行冲突
            }
        }
        if (Math.floor((blockNumId - 1) / w) + 1 >= 3) { // 从第三行开始，判断它能否进行竖向消除
            let iconA = getIconByNumId(blockNumId - w); // icon above
            let iconAA = getIconByNumId(blockNumId - 2 * w);
            if (icon.innerHTML == iconA.innerHTML && icon.innerHTML == iconAA.innerHTML) {
                return 2; // 返回列冲突
            }
        }
    }
    icon.style.color = colors[rnd]; // 设定颜色
    document.getElementById('block' + blockNumId).append(icon); // 加入块中
    icon.onpointerdown = iconOnPointerDown;
    icon.onpointerup = iconOnPointerUp;
    setTimeout(() => { // 过一段时间
        icon.style.opacity = null; // 再淡出
    }, 50);
}

function exchangeLocations(icon1, icon2) { // 其实是归位，用“交换”有点不妥
    // 先从父元素移除
    icon1.obj.remove();
    icon2.obj.remove();

    // 加入到新的对应父元素
    document.getElementById('block' + icon1.numId).append(icon1.obj);
    document.getElementById('block' + icon2.numId).append(icon2.obj);

    // 恢复一些参数到默认
    icon1.obj.style.transform = null;
    icon2.obj.style.transform = null;
    dir = [0, 0];
}

function exchangeIds(icon1, icon2) { // 交换id
    [icon1.numId, icon2.numId] = [icon2.numId, icon1.numId];
    icon1.setId('icon' + icon1.numId);
    icon2.setId('icon' + icon2.numId);
}

function setIconTransform(icon, tX, tY) { // 对给予的icon修改transform样式
    icon.obj.style.transform = (tX == 0 && tY == 0) ? null : `translate(${tX}px, ${tY}px)`;
}

function turnInputAvaliability(on) {
    document.getElementById('main').dis
}

// 类
class Icon {
    constructor(numId) {
        this.obj = getIconByNumId(numId);
        this.numId = numId;
    }
    getId() {
        return this.obj.id;
    }
    setId(id) {
        if (typeof id == 'number') { // 传来的是数字id
            id = 'icon' + id; // 加个前缀
        }
        this.obj.id = id;
    }
}