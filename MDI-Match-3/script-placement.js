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
    for (let i = 1; i <= w * h; i++) {
        if (getIconByNumId(i)) { // 应对回到前面重新生成的情况
            getIconByNumId(i).remove(); // 如果有内容了，就删掉
        }
        const code = spawnIcon(i, true);
        if (code == 1) { // 此icon与前两个相同
            i -= 3; // 回退3格
        } else if (code == 2) { // 此icon与上面两个相同
            i--; // 回退1格重新生成
        }
    }
}
