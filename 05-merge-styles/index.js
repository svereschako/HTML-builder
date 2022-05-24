const fs = require('fs');
const path = require('path');
let data = "";

fs.readdir(path.join(__dirname, "styles"), {withFileTypes: true}, (err, files) => {
	files.forEach(file => {
		if(file.isFile() && path.extname(file.name) == ".css"){
			var stream = fs.createReadStream(path.join(__dirname,"styles",file.name),"utf-8");
			stream.on('data', chunk => data += chunk);
			stream.on('end', () => fs.promises.writeFile(path.join(__dirname, "project-dist", "bundle.css"), data));
		}
	});
});

