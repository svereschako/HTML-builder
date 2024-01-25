const fs = require('fs');
const path = require('path');
const re = /\{\{\w+\}\}/gi;
let components = {};
let data = "";
let styles = "";

async function createDir() {  
  try {
    const createDir = await fs.promises.mkdir(path.join(__dirname,"project-dist"), {recursive: true});
    console.log(`Done: ${createDir}`);
  } catch (err) {
    console.error(err.message);
  }
}

function readTemplate() {
  const stream = fs.createReadStream(path.join(__dirname,"template.html"),"utf-8");
  stream.on('data', chunk => data += chunk);
  stream.on('end', async () => {	
  		await load();
  		replace();	
  });
}

function replace() {
	var ndata = data.replace(re, function(match){
		match = match.substring(2, match.length-2);
		return components[match];
	});	
	fs.promises.writeFile(path.join(__dirname, "project-dist", "index.html"), ndata);	
}

async function load() {	
	const files = await fs.promises.readdir(path.join(__dirname, "components"), {withFileTypes: true});
	for(let file of files){
		if(file.isFile() && path.extname(file.name) == ".html"){
			var data = await fs.promises.readFile(path.join(__dirname,"components",file.name),"utf-8");
			components[path.parse(file.name)["name"]] = data;
		}
	}
}

async function createCss() {
	const files = await fs.promises.readdir(path.join(__dirname, "styles"), {withFileTypes: true});
	for(let file of files) {
		if(file.isFile() && path.extname(file.name) == ".css"){
			var data = await fs.promises.readFile(path.join(__dirname,"styles",file.name),"utf-8");
			styles += data;
		}
	}
	fs.promises.writeFile(path.join(__dirname, "project-dist", "style.css"), styles);	
}

async function copyDir(src,dest) {
    const entries = await fs.promises.readdir(src, {withFileTypes: true});
    await fs.promises.mkdir(dest, {recursive: true});
    for(let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if(entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await fs.promises.copyFile(srcPath, destPath);
        }
    }
}

async function deleteFolder() {
  try {
    const stats = await fs.promises.stat(path.join(__dirname, "project-dist"));
    if (stats.isDirectory()) {
      console.log('Folder already exists. Rewriting...');
      await fs.promises.rm(path.join(__dirname, "project-dist"), { recursive: true });
    }
  } catch (err) {
    console.log('Folder does not exist. Creating new folder...');
  }  
}

async function execute() {    
  await deleteFolder();
  await createDir();
  readTemplate();
  await copyDir(path.join(__dirname, "assets"),path.join(__dirname, "project-dist", "assets"));
  await createCss();
}

execute();
