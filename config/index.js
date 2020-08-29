var httpResult = {
	success: (data = null, message = '') => ({ status: 200, data, message }),
	error: message => ({status: 500, data: null, message}),
	failure: (data = null, message = '') => ({ status: 199, data, message }),
    //token验证失败
    untoken: () =>({status:401, data:null, message:''})
};

module.exports = httpResult;