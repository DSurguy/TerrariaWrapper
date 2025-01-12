import { createServerConfig } from './serverConfig.js';

var config = require('./config.js'),
	GetServer = require('./GetServer.js'),
	spawn = require('child_process').spawn;

if( process.argv[2] == "-setup" ){
	GetServer.downloadServer(config.dedicatedServerDownload, {
		downloadLocation: config.downloadDirectory,
		zipName: config.zipName
	}).then(function (fileLoc){
		return GetServer.unzipServer({
			fullZipPath: fileLoc,
			unzipPath: config.serverDirectory
		});
	}).then(function (){
		return createServerConfig(config.serverDirectory);
	}).then(function (){
		console.log('Setup Finished, run \'npm start\' to start the server! ');
	}).catch(function (err){
		console.error(err);
		console.error(err.stack)
	});
}
else if( process.argv[2] == "-start" ){
	try{
		spawn('TerrariaServer.exe', ['-config','serverconfig.txt'], {
			stdio: 'inherit',
			cwd: './Server'
		});
	} catch(e){
		console.log(e);
	}
}