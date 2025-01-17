const fs = require('fs');
const path = require('path');
const fpath = path.join(__dirname, 'secret-folder');

fs.readdir(fpath, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    files.forEach(file => {		
      if(file.isFile()){      	
      	fs.stat(path.join(__dirname,"secret-folder",file.name), function(err, stats) {
            if (err) throw err;
      	    console.log(path.parse(file.name)["name"] + " - " + path.parse(file.name)["ext"].slice(1) + " - " + stats["size"]);      	    
      	});
      }      
    });
});

