var extend = require('extend');

module.exports = TerrariaServer;

function TerrariaServer(options){

	this.options = extend(false, {
		//information for serverconfig.txt
		config: {
			server: {
				worldFolder: undefined,
				worldFileName: undefined,
				maxPlayers: undefined,
				port: undefined,
				password: undefined,
				banlist: undefined,
				language: undefined,
				motd: undefined
			}, world: {
				worldName: undefined,
				worldSize: undefined,
				difficulty: undefined
			}
		},
		//url to the latest release of the dedicated server software
		dedicatedServerDownload: 'http://terraria.org/server/terraria-server-1304.zip',
		//directory that the server .zip will be downloaded to
		downloadDirectory: './Server',
		//directory to run the server in (.zip files will be extracted here)
		serverDirectory: './Server',
		//Custom name for the zip, in case of multiple instances/downloads
		zipName: 'server.zip',
		//interface used to capture input and listen/respond to events
		io: undefined 
	}, options ? options : {});

	this.init = function(io){
		var TerrariaServer = this;
		//1. Download the server software
		this.downloadServer(this.options.dedicatedServerDownload, {
			zipName: this.options.zipName,
			downloadLocation: this.options.downloadDirectory
		//2. Unzip to target directory
		}).then(function (newZipFile){
			return TerrariaServer.unzipServer({
				fullZipPath: newZipFile,
				unzipPath: TerrariaServer.options.serverDirectory
			});
		//3. Config Server
		}).then(function (){
			return TerrariaServer.createServerConfig(this.options.serverDirectory);
		}).catch(function (err){
			console.error(err);
			console.error(err.stack)
		});
	};

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

		var configDefinition = [{
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
		}, {
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
		}];

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