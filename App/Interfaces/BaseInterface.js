var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	Q = require('Q');

module.exports = BaseInterface;

function BaseInterface(){};
util.inherits(BaseInterface, EventEmitter);

/*
* 	Send a message (prompt) to the active UI and request input
*	PromptData is optional, but may help senders and listeners to 
*	circumvent the UI when appropriate
*/
BaseInterface.prototype.requestInput = function(prompt, promptData){
	var defer = Q.defer();
	if( typeof prompt == 'string' || (prompt.constructor.name == 'Array' && typeof prompt[0] == 'string') ){
		//prompt the UI for input
		this.emit('requestInput', prompt, defer);
	}
	else{
		defer.reject(new Error('Prompt was not of types <string> or Array<string>'));
	}

	return defer.promise;
};

/*
*	Send a message to be disaplayed on the active UI
*/
BaseInterface.prototype.output = function(message){
	var defer = Q.defer();

	if( typeof prompt == 'string' || (prompt.constructor.name == 'Array' && typeof prompt[0] == 'string') ){
		//prompt the UI for input
		this.emit('output', prompt, defer);
	}
	else{
		defer.reject(new Error('Prompt was not of types <string> or Array<string>'));
	}

	return defer.promise;
};

/*
*	
*/
BaseInterface.prototype.command = function(cmd, cmdData){
	//emit the passed command event with the passed data
	this.emit(cmd, cmdData);
};