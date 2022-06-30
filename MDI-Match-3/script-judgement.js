let changedIcons = [];

function judge(icons) {
    let matchResult = false;
    icons.forEach(icon => { // 轮番判断所有参数给的值
        matchResult = match(check(icon), icon.numId) || matchResult;
    });
    return matchResult;
}

function check(icon) { // 参数为中心icon
    let matchNum = [-1, -1, -1, -1]; // 中心icon左右上下相连同样icon的数量
    for (let i = 0; i < 4; i++) { // 上下左右都要检查
        let curNumId = icon.numId;
        do { // 先左右再上下
            matchNum[i]++;
            curNumId -= ((-1) ** i) * (w ** Math.floor(i / 2));
        } while (areMatched(icon, curNumId)); // 两者相同&在同一行/列
    }
    return matchNum;
}

function areMatched(icon, curNumId) { // 判断给予的两个icon是否在同一行或列上且相同
    if (curNumId <= 0 || curNumId > w * h) { // cur的数字id不在范围内
        return false;
    } else if ((icon.numId - 1) % w != (curNumId - 1) % w && Math.floor((icon.numId - 1) / w) != Math.floor((curNumId - 1) / w)) { // 不在同一行列上
        return false;
    } else if (getIconByNumId(icon.numId).innerHTML != getIconByNumId(curNumId).innerHTML) { // 两个icon内容不相同
        return false;
    } else { // 验证通过
        return true;
    }
}

function match(matchNum, iconNumId) { // 匹配iconNumId所在的位置是否有三个以上可以相连的icon
    let matchResult = false;
    for (let i = 0; i < 4; i += 2) { // 左右上下
        if (matchNum[i] + matchNum[i + 1] >= 2) { // 如果这行/列能消除
            const ori = w ** (i / 2); // orientation，横着等于1，竖着等于w
            for (let j = iconNumId - matchNum[i] * ori; j <= iconNumId + matchNum[i + 1] * ori; j += ori) {
                getIconByNumId(j).style.opacity = '0'; // 隐藏能连起来的
                matchResult = true;
            }
        }
    }
    return matchResult;
}

function fall() { // 下落判定
    changedIcons = [];
    for (let c = 1; c <= w; c++) { // c 为第几列
        let cur1 = w * (h - 1) + c; // 指向最底层
        while (cur1 > 0 && getIconByNumId(cur1).style.opacity != '0') { // 向上找空缺
            cur1 -= w;
        }
        let cur2 = cur1;
        while (cur2 > w) { // 向上找有的
            cur2 -= w;
            if (getIconByNumId(cur2).style.opacity != '0') { // 找到有的
                const icon1 = new Icon(cur1), icon2 = new Icon(cur2);
                exchangeIds(icon1, icon2);
                exchangeLocations(icon1, icon2); // 交换位置
                // 动画
                // icon2.obj.style.transition = 'all 0s';
                // setIconTransform(icon2, 0, -(icon1 - icon2) / w * 50);
                // icon2.obj.style.transition = null;
                // setTimeout(setIconTransform, 50, 0, 0); // 延时执行确保动画播放
                // 动画
                changedIcons.push(icon2);
                cur1 -= w;
            }
        }
        while (cur1 > 0) {
            getIconByNumId(cur1).remove();
            spawnIcon(cur1);
            changedIcons.push(new Icon(cur1));
            cur1 -= w;
        }
    }
    setTimeout(() => {
        if (judge(changedIcons)) {
            setTimeout(fall, 500);
        }
    }, 100);
}

function areBlockAndIconMatch(blockNumId) {
    return getBlockByNumId(blockNumId).firstChild.id == 'icon' + blockNumId;
}
