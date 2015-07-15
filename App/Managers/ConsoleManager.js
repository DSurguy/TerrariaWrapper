var BaseInterface = require('../Interfaces/BaseInterface'),
	colors = require('colors'),
	path = require('path'),
	readline = require('readline'),
	Q = require('Q');

var pkg = require(path.dirname(require.main.filename)+'/package.json');

module.exports = ConsoleManager;

function ConsoleManager(){
	this.servers = [];
	this.IO = readline.createInterface(
		process.stdin,
		process.stdout
	);
	this.configStore = {
		servers: [],
	};
	this._status = {
		curStatus: 0,
		IDLE: 0,
		STARTING: 1,
		RUNNING: 2,
		EXITING: 3
	};
};

ConsoleManager.prototype.currentStatus = function(){
	return this._status.curStatus;
};

/*
*	Start the console manager and allow user input to control servers
*/
ConsoleManager.prototype.run = function(){
	var CM = this;

	//process.stdout.write('\033c');
	CM.IO.write('\033c');
	CM.IO.write('Welcome to Terraria Server Manager - Console Version - v'+pkg.version+'\r\n');
	//Bootstrapping Config
	CM.IO.write('Bootstrapping Config...'.cyan);
	CM._bootstrapConfigStore();
	CM.IO.write('Done.'.green+'\n');

};

ConsoleManager.prototype.detectServers = function(){
	var defer = Q.defer();



	return defer.promise;
};

ConsoleManager.prototype._bootstrapConfigStore = function(){
	var CM = this;

	//try to load the configStore
	try{
		CM.configStore = extend(true, CM.configStore, require('../../Store/configStore.json'));
	}
	catch (e){
		CM.configStore = extend(true, CM.configStore, {});
	}
};