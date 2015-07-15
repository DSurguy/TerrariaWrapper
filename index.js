var unzip = require('unzip'),
	config = require('./config.js'),
	spawn = require('child_process').spawn,
	exec = require('child_process').exec,
	Q = require('q');

/*if( process.argv[2] == "-setup" ){
	var GetDefer = Q.defer();
	GetServer.downloadServer(config.dedicatedServerDownload, {
		downloadLocation: config.downloadDirectory,
		zipName: config.zipName
	}).then(function (fileLoc){
		return GetServer.unzipServer({
			fullZipPath: fileLoc,
			unzipPath: config.serverDirectory
		});
	}).then(function (){
		return ConfigServer.createServerConfig(config.serverDirectory);
	}).then(function (){
		console.log('Setup Finished, run \'npm start\' to start the server! ');
	}).catch(function (err){
		console.error(err);
		console.error(err.stack)
	});
}
else if( process.argv[2] == "-start" ){
	try{
		var serverProcess = spawn('TerrariaServer.exe', ['-config','serverconfig.txt'], {
			stdio: 'inherit',
			cwd: './Server'
		});
	} catch(e){
		console.log(e);
	}
}*/

var app = require('./App/start.js');

app.run();