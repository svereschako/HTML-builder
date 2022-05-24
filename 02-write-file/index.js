const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const filepath = path.join(__dirname, 'dest.txt');
const output = fs.createWriteStream(filepath);


stdout.write('Enter your message\n');
stdin.on('data', data => {
	if(data.toString().trim().toLowerCase() === "exit")
		process.exit();
	//console.log(data.toString());       
	output.write(data + "\n");	
});
process.on('exit', () => stdout.write('Удачи!'));
process.on('SIGINT', () => {
  process.exit();
});