// 函数
function getIconByNumId(iconNumId) {
    return document.getElementById('icon' + iconNumId);
}

function getNumIdByObj(icon) {
    return parseInt(icon.id.substring(4));
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