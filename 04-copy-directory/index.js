const fs = require('fs');
const path = require('path');
const fpath = path.join(__dirname, 'files');

fs.promises.mkdir(path.join(__dirname,"files-copy"), {recursive: true});
fs.readdir(fpath, (err, files) => {
	files.forEach(file => {
		fs.promises.copyFile(path.join(__dirname,"files",file), path.join(__dirname,"files-copy",file));
	});
});
