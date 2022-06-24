function judge(icons) {
    let matchResult = false;
    icons.forEach(icon => { // 轮番判断所有参数给的值
        matchResult = match(check(icon), icon.numId) || matchResult;
    }); // 现在需要将两个id临时换一下，不行再换回来，否则不好参与判断
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
                getIconByNumId(j).style.opacity = '0.2'; // 隐藏能连起来的
                matchResult = true;
            }
        }
    }
    return matchResult;
}

function fall() { // 下落判定

}