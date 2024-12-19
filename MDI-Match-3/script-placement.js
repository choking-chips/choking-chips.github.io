let w, h, var_qty = 3;
function apply() {
    let widthInput = document.getElementById('width'), heightInput = document.getElementById('height');
    if (widthInput.value >= 5 && heightInput.value >= 5) {
        document.getElementById('main').innerHTML = ''; // 清空原棋盘
        w = parseInt(widthInput.value), h = parseInt(heightInput.value);
        var_qty = parseInt(document.getElementById('var_qty').value);
        placeBlocks();
        placeIcons(var_qty);

        document.getElementById('apply').innerHTML = '应用并重置';
    }
}

function placeBlocks() {
    for (let i = 0; i < h; i++) {
        // 外循环，执行一次即创建一个新行
        let newRow = document.createElement('div');  // 一个新行
        newRow.className = 'row';
        for (let j = 1; j <= w; j++) {
            // 内循环，执行一次将一个块加入
            let newBlock = document.createElement('span'); // 一个新块
            newBlock.id = 'block' + (i * w + j).toString(); // 添加id
            newBlock.className = 'block'; // 添加默认的类名
            newRow.append(newBlock); // 将块添加到行中
        }
        document.getElementById('main').append(newRow); // 将行添加到游戏区域中
    }
}

function placeIcons() {
    let icons = ['info', 'warning', 'error'];
    let colors = ['skyblue', 'orange', 'red'];
    for (let i = 1; i <= w * h; i++) {
        if (getIconByNumId(i)) { // 应对回到前面重新生成的情况
            getIconByNumId(i).remove(); // 如果有内容了，就删掉
        }
        let icon = document.createElement('span');
        icon.id = 'icon' + i;
        icon.className = 'icon mdi';
        let rnd = Math.floor(Math.random() * var_qty);
        icon.innerHTML = icons[rnd];
        if ((i - 1) % w + 1 >= 3) { // 从一行的第三个开始，判断它能否进行横向消除
            let iconOTL = getIconByNumId(i - 1); // icon on the left
            let iconOTLL = getIconByNumId(i - 2);
            if (icon.innerHTML == iconOTL.innerHTML && icon.innerHTML == iconOTLL.innerHTML) {
                i -= 3; // 回到前面重新生成
                continue;
            }
        }
        if (Math.floor((i - 1) / w) + 1 >= 3) { // 从第三行开始，判断它能否进行竖向消除
            let iconA = getIconByNumId(i - w); // icon above
            let iconAA = getIconByNumId(i - 2 * w);
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
