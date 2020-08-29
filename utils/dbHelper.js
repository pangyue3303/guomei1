//链接数据库,执行指定的sql语句并得到结果,
var mysql = require('mysql');
//query返回一个promise对象
var query = (sql, params) => {
	var connection = mysql.createConnection({
		host: 'localhost',
		database: 'phonexiangmu',
		user: 'root',
		password: '123'
	});
	return new Promise( (resolve, reject) => {
		connection.query(sql, params, (err, results, fields)=> {
			connection.end();
			if(err) {console.log(err.message); reject(err); }
			else resolve(results);
		});
	});
	
}
module.exports = query;