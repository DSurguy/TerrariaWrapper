var Q = require('q'),
	path = require('path'),
	extend = require('extend'),
	fs = require('fs');

module.exports = new ConfigServer();
function ConfigServer(){

	this.createServerConfig = function (serverLocation){
		var defer = Q.defer();

		this.gatherConfig().then( function (configData){
			var configString = [];

			configString.push('#World File Settings');
			configString.push('world='+path.resolve(configData.worldFolder)+'\\'+configData.worldFileName+'.wld');
			configString.push('worldpath='+path.resolve(configData.worldFolder));
			configString.push('');
			configString.push('#Banlist');
			configString.push('banlist='+path.resolve(configData.worldFolder)+'\\'+path.normalize(configData.banlist) );
			configString.push('');
			configString.push('#Server Setup');
			configString.push('motd='+configData.motd);
			configString.push('port='+configData.port);
			configString.push('password='+configData.password);
			configString.push('maxplayers='+configData.maxPlayers);
			configString.push('secure=1');
			configString.push('lang='+configData.language);
			configString.push('priority=1');
			configString.push('#upnp=1');
			configString.push('#npcstream=60');
			configString.push('');
			configString.push('#World Setup');
			configString.push('worldname='+configData.worldName);
			configString.push('autocreate='+configData.worldSize);
			configString.push('diffculty='+configData.difficulty);

			fs.writeFile(serverLocation+'\\serverconfig.txt', configString.join('\r\n'), function(){
				defer.resolve();
			});

		}).catch(function (err){
			var myErr = new Error('Error writing serverconfig.txt: '+err.message);
			myErr.stack = err.stack;
			defer.reject(myErr);
		});

		return defer.promise;
	};

	this.gatherConfig = function(){

		var defer = Q.defer();

		var that = this,
			configData = {};

		this.collectConfigPrompts(configData, 'server').then( function (updatedConfig){
			return that.collectConfigPrompts(updatedConfig, 'world');
		}).then( function (finalConfig){
			defer.resolve(extend(true, {}, finalConfig));
		}).catch( function (err){
			console.log(err);
		});

		return defer.promise;
	};

	this.collectConfigPrompts = function(configObject, promptGroup){
		var defer = Q.defer(),
			thisConfig = extend(true, {}, configObject);

		(function getInput(index){
			var configItem = configDefinition[promptGroup][index];
			if( configItem ){
				process.stdout.write(configItem.prompt+'\n');
				process.stdin.resume();

				process.stdin.once('data', function (text){
					process.stdin.pause();
					if( text.toString().trim() === '' ){
						//use the default value for this config
						thisConfig[configItem.mapTo] = configItem.default;
					}
					else{
						thisConfig[configItem.mapTo] = text.toString().trim().split(/\n\r/g)[0];
					}

					getInput(index+1);
				});
			}
			else{
				defer.resolve(thisConfig);
			}
		})(0);

		return defer.promise;
	};
};

var configDefinition = {
	server: [{
		prompt: 'World File Folder (Default: ".\\Server\\Worlds")',
		default: '.\\Server\\Worlds',
		mapTo: 'worldFolder'
	}, {
		prompt: 'World File Name (Default: "Server")',
		default: 'Server',
		mapTo: 'worldFileName'
	}, {
		prompt: 'Maximum Players (Default: 8)',
		default: 8,
		mapTo: 'maxPlayers'
	}, {
		prompt: 'Port (Default: 7777)',
		default: 7777,
		mapTo: 'port'
	}, {
		prompt: 'password (Default: none)',
		default: undefined,
		mapTo: 'password'
	}, {
		prompt: 'File for banlist (Default: ".\\banlist.txt")',
		default: '.\\banlist.txt',
		mapTo: 'banlist'
	}, {
		prompt: 'Language 1=English, 2=German, 3=Italian, 4=French, 5=Spanish (Default: 1)',
		default: 1,
		mapTo: 'language'
	}, {
		prompt: 'MOTD (Default: "Welcome to Terraria!")',
		default: 'Welcome to Terraria!',
		mapTo: 'motd'
	}],
	world: [{
		prompt: 'World Name (Default: "MyWorld")',
		default: 'MyWorld',
		mapTo: 'worldName'
	}, {
		prompt: 'World Size 1=small, 2=medium, 3=large (Default: 2)',
		default: 2,
		mapTo: 'worldSize'
	}, {
		prompt: 'Difficulty 0=Normal, 1=Expert (Default: 0)',
		default: 0,
		mapTo: 'diffculty'
	}]
};