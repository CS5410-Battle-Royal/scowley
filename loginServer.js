var express = require('express');
var bodyParser = require('body-parser');
var sqlite = require('sqlite3');
var fs = require('fs');
var path=require('path');

let mimeTypes = {
  '.js' : 'text/javascript',
  '.html' : 'text/html',
  '.css' : 'text/css',
  '.png' : 'image/png',
  '.jpg' : 'image/jpeg',
  '.mp3' : 'audio/mpeg3'
};

//sql
var db = new sqlite.Database('users.db');
 
db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS users (user TEXT PRIMARY KEY, pass TEXT)");
});

var app = express();

app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/css',express.static(path.join(__dirname,'css')));

app.post('/signup.html', function(request, response) {

  db.run('INSERT INTO users(user,pass) VALUES (?,?)', [request.body['name-username'], request.body['name-password']],function(err, row){
    if(err){
      if(err.errno === 19) {
        console.log("User already exists");
      } else {
        console.log(err);
      }
    }else {
      fs.readFile('game.html', function(err, data) {
        if (err) {
          response.writeHead(500);
          response.end('Server Error!');
        } else {
          let headers = {'Content-type': mimeTypes[path.extname('game.html')]};
          response.writeHead(200, headers);
          response.end(data);
        }
      });
    }
  })
});

app.post('/signin.html', function(request, response) {

  db.get('SELECT pass FROM users WHERE user = ?', request.body['name-username'],function(err, row){
    if(err){
      console.log(err);
    }else if(typeof row !== 'undefined' && row.pass === request.body['name-password']){
      fs.readFile('game.html', function(err, data) {
        if (err) {
          response.writeHead(500);
          response.end('Server Error!');
        } else {
          let headers = {'Content-type': mimeTypes[path.extname('game.html')]};
          response.writeHead(200, headers);
          response.end(data);
        }
      });
    }else{
      fs.readFile('signine.html', function(err, data) {
        if (err) {
          response.writeHead(500);
          response.end('Server Error!');
        } else {
          let headers = {'Content-type': mimeTypes[path.extname('signine.html')]};
          response.writeHead(200, headers);
          response.end(data);
        }
      });
    }
  })
});

app.get('*', function(request, response){
  let lookup = (request.url === '/') ? '/index.html' : decodeURI(request.url);

  let file = lookup.substring(1, lookup.length);

  fs.exists(file, function(exists) {
    if (exists) {
      fs.readFile(file, function(err, data) {
        if (err) {
          response.writeHead(500);
          response.end('Server Error!');
        } else {
          let headers = {'Content-type': mimeTypes[path.extname(lookup)]};
          response.writeHead(200, headers);
          response.end(data);
        }
      });
    } else {
      response.writeHead(404);
      response.end();
    }
  });
});

app.listen(3000, function() {
  console.log('Server running at http://127.0.0.1:3000/');
});