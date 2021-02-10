const args = process.argv.slice(2);
const request = require('request');
const fs = require('fs');
const readline = require('readline');

const callBackFunc = function(bytes,args) {
  return console.log(`Downloaded and saved ${bytes} bytes to ${args[1]}`);
};

const fetch = function(args,callBackFunc) {
  request(args[0], (error, response, body) => {
  
    if (error !== null) {
      console.log(`${error}`);
      return;
    }

    if (response.statusCode !== 200) {
      console.log(`An error has occurred: status code ${response.statusCode}`);
      return;
    }

    if (fs.existsSync(args[1])) {
    
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question('File already exists, type y if you would like to replace it.' , (answer) => {
        if (answer.toLowerCase() !== 'y') {
          rl.close();
          return;
        } else {
          fs.writeFile(`${args[1]}`, body, (err) => {
            if (err) throw err;
            const {size} = fs.statSync(`${args[1]}`);
            return callBackFunc(size ,args);
          });
        }
        rl.close();
      });
    } else {
      fs.writeFile(`${args[1]}`, body, (err, bytes) => {
        if (err) throw err;
        const {size} = fs.statSync(`${args[1]}`);
        return callBackFunc(size ,args);
      });
    }
  });
};

fetch(args,callBackFunc);