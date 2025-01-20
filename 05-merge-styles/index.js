const fs = require('fs');
const path = require('path');
let styles = "";

async function createBundle () {
	const files = await fs.promises.readdir(path.join(__dirname, "styles"), {withFileTypes: true});
	for(let file of files) {
		if(file.isFile() && path.extname(file.name) == ".css"){
			var data = await fs.promises.readFile(path.join(__dirname,"styles",file.name),"utf-8");
			styles += data;
		}
	}
	fs.promises.writeFile(path.join(__dirname, "project-dist", "bundle.css"), styles);	
}

createBundle();
