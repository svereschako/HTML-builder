const fs = require('fs');
const path = require('path');
const fpath = path.join(__dirname, 'files');

fs.promises.mkdir(path.join(__dirname,"files-copy"), {recursive: true});

fs.readdir(path.join(__dirname,"files-copy"), (err,files) => {
	files.forEach(file => {
		fs.unlink(path.join(__dirname,"files-copy", file), err => {
		    if (err) throw err;
		});
	});
});

fs.readdir(fpath, (err, files) => {
	files.forEach(file => {
		fs.promises.copyFile(path.join(__dirname,"files",file), path.join(__dirname,"files-copy",file));
	});
});
