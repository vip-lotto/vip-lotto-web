const express = require("express");
const fs = require("fs");
const session = require("express-session");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use(session({
secret:"lotto-secret",
resave:false,
saveUninitialized:true
}));

/* LOGIN */

app.post("/login",(req,res)=>{

const {username,password} = req.body;

if(username==="admin" && password==="1234"){
req.session.login=true;
res.json({status:"ok"});
}else{
res.json({status:"fail"});
}

});

/* LOGOUT */

app.get("/logout",(req,res)=>{
req.session.destroy();
res.redirect("/login.html");
});

/* CHECK LOGIN */

app.get("/check",(req,res)=>{
if(req.session.login){
res.json({login:true});
}else{
res.json({login:false});
}
});

/* DATA */

app.get("/data",(req,res)=>{
const data = JSON.parse(fs.readFileSync("data.json"));
res.json(data);
});

/* SAVE */

app.post("/save",(req,res)=>{

if(!req.session.login){
return res.json({status:"nologin"});
}

const {number,date} = req.body;

let data = JSON.parse(fs.readFileSync("data.json"));

data.number = number;

data.history.unshift({
date:date,
number:number
});

data.history = data.history.slice(0,7);

fs.writeFileSync("data.json",JSON.stringify(data,null,2));

res.json({status:"ok"});

});

app.listen(3000,()=>{
console.log("Server running http://localhost:3000");
});