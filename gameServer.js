'use strict'

let express = require('express');
let sqlite = require('sqlite3');
let fs = require('fs');
let path=require('path');
var bodyParser = require('body-parser');

let app = express();
let http = require('http').Server(app);
var io = require('socket.io')(http);

let mimeTypes = {
  '.js' : 'text/javascript',
  '.html' : 'text/html',
  '.css' : 'text/css',
  '.png' : 'image/png',
  '.jpg' : 'image/jpeg',
  '.mp3' : 'audio/mpeg3'
};

//sql
let db = new sqlite.Database('users.db');

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS users (user TEXT PRIMARY KEY, pass TEXT)");
});


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

app.use('/css',express.static(path.join(__dirname,'css')));
app.use('/scripts',express.static(path.join(__dirname,'scripts')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', function(request, response){

  response.sendfile(path.join(__dirname, 'page.html'));

});

app.post('/signin', function(request, response) {
  db.get('SELECT pass FROM users WHERE user = ?', request.body['username'],function(err, row){
    if(err){
      response.json({error:err});
    }else if(typeof row === 'undefined') {
      response.json({error:'User does not exist'});
    } else if(row.pass === request.body['password']){
      response.json({error:null,authenticated:true});
    }else{
      response.json({error:'Invalid Password'});      
    }
  })
});

app.post('/signup', function(request, response) {

  db.run('INSERT INTO users(user,pass) VALUES (?,?)', [request.body['username'], request.body['password']],function(err, row){
    if(err){
      if(err.errno === 19) {
        response.json({error:"User already exists"});
      } else {
        response.json({error:err});
      }
    }else {
      response.json({error:null,authenticated:true});
    }
  })
});

app.use('*', function(request, response){
  //response.sendfile(path.join(__dirname, 'page.html'));
  response.status(404).send("Not found");
})

let activeUsers = [];

io.on('connection', function(socket){
  socket.on('join', function(data){
    console.log(data.name + ' with id ' + socket.id + ' connected');
    activeUsers.push({
      username: data.name,
      socketId: socket.id
    });

    socket.on('disconnect', function(){
      console.log(data.name + ' with id ' + socket.id + ' disconnected');
    });
  });
});

http.listen(3000, function() {
  console.log('Server running at http://localhost:3000/');
});