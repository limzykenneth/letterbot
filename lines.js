var exec = require('child_process').exec;

module.exports = function (callback){
	var r = exec('wc -l wordlistv.txt', function(error, stdout, stderr){
		callback(stdout);
	});
};
