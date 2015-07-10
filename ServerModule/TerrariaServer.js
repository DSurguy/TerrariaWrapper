var extend = require('extend');

module.exports = TerrariaServer;

function TerrariaServer(options){

	this.options = extend(false, {
		serverConfig: {
			
		}
	}, options);

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

	this.downloadServer = function(downloadURL, options){
		//prep the options
		options = extend(true, {
			zipName: 'server.zip',
			downloadLocation: './Server'
		}, options);

		var Defer = Q.defer();
		//create the local directory to house the actual terraria server
		fs.mkdir(options.downloadLocation, function (result){
			if( result === null || result.code == 'EEXIST' ){
				//we created the directory or it already exists, attempt to download the server zip
				var zipFile = fs.createWriteStream(options.downloadLocation+'/'+options.zipName);
				var request = http.get(downloadURL, function (response){
					zipFile.on('finish', function(){
						//finished writing, resolve with the path to the file
						Defer.resolve(options.downloadLocation+'/'+options.zipName);
					});

					zipFile.on('error', function (err){
						Defer.reject(new Error('Attemted to write '+options.downloadLocation+'/'+options.zipName+' but failed with result: '+err.message));
					});

					response.pipe(zipFile);
				});
			}
			else{
				Defer.reject(new Error('Attemted to create '+options.downloadLocation+' but failed with result: '+result));
			}
		});
		return Defer.promise;
	};

	this.unzipServer = function(options){
		//prep the options
		options = extend(true, {
			fullZipPath: './Server/server.zip',
			unzipPath: undefined
		}, options);
		if( options.unzipPath === undefined ){
			options.unzipPath = options.fullZipPath.split(/[\/\\]/g).slice(0,-1).join('/');
		}

		var Defer = Q.defer();

		try{
			var dumpStream = unzip.Extract({ path: options.unzipPath});
			var readStream = fs.createReadStream(options.fullZipPath);

			dumpStream.on('close', function(){
				Defer.resolve();
			});

			dumpStream.on('error', function (err){
				Defer.reject(new Error('Error extracting server ('+options.fullZipPath+') to unzip directory('+options.unzipPath+'): '+err.message));
			});

			readStream.pipe(dumpStream);
		}
		catch (err){
			Defer.reject(new Error('Error extracting server ('+options.fullZipPath+') to unzip directory('+options.unzipPath+'): '+err.message));
		}

		return Defer.promise;
	};
};