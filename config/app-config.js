/**
* 系统配置
*/
const env = process.env.NODE_ENV || 'prod';
const config = {

};


module.exports = Object.assign({}, config[env], { site: 4, terminal: 0 });
