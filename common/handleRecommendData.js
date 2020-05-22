// 处理推荐位数据

module.exports = function (list){
    let arr = []
    list.forEach(item=>{
        let temp = {}
        if(item.type == 1){ // 资料 
            temp = Object.assign({},item,{linkUrl:`/f/${item.tprId}.html`})
        }
        if(item.type == 2){ // 链接
            temp = Object.assign({},item)
        }
        if(item.type == 3){ // 专题页
            temp = Object.assign({},item,{linkUrl:`/node/s/${tprId}.html`})
        }
    })
    return arr
}