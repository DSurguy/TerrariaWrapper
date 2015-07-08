var http = require('http'),
	fs = require('fs'),
	Q = require('q'),
	unzip = require('unzip'),
	extend = require('extend');

module.exports = {
	downloadServer: function(downloadURL, options){
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
	},
	unzipServer: function(options){
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
	}
};