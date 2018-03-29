document.getElementById('id-signup').hidden = true;
document.getElementById('id-join').hidden = true;

document.getElementById('button-signin').addEventListener('click',function(){
    let req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open("POST", "/signin");
    req.setRequestHeader("Content-Type","application/json");
    req.onload  = function() {
      var jsonResponse = req.response;
      // do something with jsonResponse
      if(req.response.error) {
        document.getElementById('id-signinerror').innerHTML = req.response.error;
      } else if (req.response.authenticated) {
        document.getElementById('id-join').hidden = false;
        document.getElementById('id-welcome').hidden = true;
        document.getElementById('id-signup').hidden = true;
      } else {
        document.getElementById('id-signinerror').innerHTML = "Unknown Error";
      }
   };
  //  req.send({'user':'username'});
    req.send(JSON.stringify({'username': document.getElementById("id-username").value, 'password': document.getElementById("id-password").value}));
});

document.getElementById('button-signup').addEventListener('click',function(){
  let req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open("POST", "/signup");
  req.setRequestHeader("Content-Type","application/json");
  req.onload  = function() {
    var jsonResponse = req.response;
    // do something with jsonResponse
    if(req.response.error) {
      document.getElementById('id-signuperror').innerHTML = req.response.error;
    } else if (req.response.authenticated) {
      document.getElementById('id-join').hidden = false;
      document.getElementById('id-welcome').hidden = true;
      document.getElementById('id-signup').hidden = true;
    } else {
      document.getElementById('id-signinerror').innerHTML = "Unknown Error";
    }
 };
  req.send(JSON.stringify({'username': document.getElementById("id-newusername").value, 'password': document.getElementById("id-newpassword").value}));
});

document.getElementById('button-newuser').addEventListener('click',function(){
  document.getElementById('id-signup').hidden = false;
  document.getElementById('id-welcome').hidden = true;
  
});

document.getElementById('button-signinret').addEventListener('click',function(){
  document.getElementById('id-welcome').hidden = false;
  document.getElementById('id-signup').hidden = true;
  
});

let passMatch = function(){
  let p1 = document.getElementById('id-newpassword').value;
  let p2 = document.getElementById('id-newpassword2').value;
  if(p1 !== "" && p1 === p2){
    document.getElementById('button-signup').disabled = false;
    document.getElementById('id-signuperror').innerHTML = "";
  } else{
    document.getElementById('button-signup').disabled = true;
    document.getElementById('id-signuperror').innerHTML = "Passwords don't match";
  }
};

document.getElementById('id-newpassword').addEventListener('keydown', passMatch)
document.getElementById('id-newpassword2').addEventListener('keyup', passMatch)
