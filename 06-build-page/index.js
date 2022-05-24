const fs = require('fs');
const path = require('path');
const re = /\{\{\w+\}\}/gi;
const FSP = require('fs').promises;
//const fse = require('fs-extra');
//const re = /header/gi;
let components = {};
let data = "";
let styles = "";
//let mx = "lkjfiowejf{{eifwoefj}}owefjowef{{header}}wioejfoiwejf{{footer}}fjowiejfiowejfoiwefjiowefj";

fs.promises.mkdir(path.join(__dirname,"project-dist"), {recursive: true});
const stream = fs.createReadStream(path.join(__dirname,"template.html"),"utf-8");
stream.on('data', chunk => data += chunk);
stream.on('end', () => load());

function replace() {
	var ndata = data.replace(re, function(match){
		match = match.substring(2, match.length-2);
		return components[match];
	});
	//var ndata = data.replace(re, "hello");
	//console.log( typeof data);
	fs.promises.writeFile(path.join(__dirname, "project-dist", "index.html"), ndata);	
}

function getContent(name){
	var content = "";
	name = name.substring(2,name.length-2);
	var strm = fs.createReadStream(path.join(__dirname, "components", name + ".html"),"utf-8");
	strm.on('data', chunk => content += chunk);
	return strm.on('end', () => content);
}




function load() {
	fs.readdir(path.join(__dirname, "components"), {withFileTypes: true}, (err, files) => {
		files.forEach(file => {
			if(file.isFile() && path.extname(file.name) == ".html"){				
				var stream = fs.createReadStream(path.join(__dirname,"components",file.name),"utf-8");
				components[path.parse(file.name)["name"]] = "";			
				stream.on('data', chunk => components[path.parse(file.name)["name"]] += chunk);
				stream.on('end', () => {
					console.log("component is loaded");
					replace();
				});				
			}
		});
	});
}


fs.readdir(path.join(__dirname, "styles"), {withFileTypes: true}, (err, files) => {
	files.forEach(file => {
		if(file.isFile() && path.extname(file.name) == ".css"){			
			var stream = fs.createReadStream(path.join(__dirname,"styles",file.name),"utf-8");
			stream.on('data', chunk => styles += chunk);						
			stream.on('end', () => fs.promises.writeFile(path.join(__dirname, "project-dist", "style.css"), styles));
		}
	});
});

/*fs.readdir(path.join(__dirname, "assets"), (err, files) => {
	files.forEach(file => {
		fs.promises.copyFile(path.join(__dirname,"assets",file), path.join(__dirname,"project-dist", "assets",file));
	});
});*/

function copy(from, to) {
	fs.readdir(from, {withFileTypes: true}, (err, files) => {		
		files.forEach(file => {			
			if(file.isDirectory()){
				fs.mkdirSync(to, {recursive: true});
				fs.readdirSync(from, (err, files) => {
					files.forEach(fl => {
						copy(path.join(from, fl), path.join(to, fl));
					});
				});
			}else{
				fs.promises.copyFile(from, to);
			}						
		});
	});
}

//copy(path.join(__dirname,"assets"), path.join(__dirname,"project-dist", "assets"));

async function copyDir(src,dest) {
    const entries = await FSP.readdir(src, {withFileTypes: true});
    await FSP.mkdir(dest, {recursive: true});
    for(let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if(entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await FSP.copyFile(srcPath, destPath);
        }
    }
}
copyDir(path.join(__dirname,"assets"),path.join(__dirname,"project-dist", "assets"));