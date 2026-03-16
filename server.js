const session = require("express-session")
const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()

app.use(express.json())
app.use(express.static("public"))

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/admin", (req, res) => {
    if (req.session.user === "admin") {
        res.sendFile(path.join(__dirname, "public", "admin.html"));
    } else {
        res.redirect("/login");
    }
});

app.use(session({
 secret: "lotto-secret",
 resave: false,
 saveUninitialized: true
}))

const DATA_FILE = "data.json"


/* -----------------------
   อ่านข้อมูล
----------------------- */

app.get("/api/data",(req,res)=>{

try{

const data = fs.readFileSync(DATA_FILE,"utf8")

res.json(JSON.parse(data))

}catch(err){

res.json({
number:"000000",
date:"",
spinStart:"18:25",
drawTime:"18:30"
})

}

})
app.get("/api/history",(req,res)=>{
    const data = fs.readFileSync("history.json","utf8")
    res.json(JSON.parse(data))
})
/* -------------------------
   login admin
------------------------- */

app.post("/api/login",(req,res)=>{

 const user = req.body.user
 const pass = req.body.pass

 if(user === "admin" && pass === "888999"){
  req.session.user = "admin"
  res.json({status:"ok"})
 }else{
  res.json({status:"fail"})
 }

})
app.get("/api/logout",(req,res)=>{

 req.session.destroy(()=>{
  res.json({status:"ok"})
 })

})

/* -----------------------
   บันทึกข้อมูล
----------------------- */

app.post("/api/save",(req,res)=>{

    // ตรวจ login ก่อน
if(!req.session.user){
  return res.status(401).json({error:"not login"})
}

const number = req.body.number
const date = req.body.date
const spinStart = req.body.spinStart
const drawTime = req.body.drawTime

const data = {

number:number,
date:date,
spinStart:spinStart,
drawTime:drawTime

}

// บันทึกประวัติ
let history = []

try{
history = JSON.parse(fs.readFileSync("history.json","utf8"))
}catch{}

history.push(data)
history = history.slice(-50)

fs.writeFileSync("history.json",JSON.stringify(history,null,2))
fs.writeFileSync(DATA_FILE,JSON.stringify(data,null,2))

res.json({status:"ok"})

})


/* -----------------------
   เปิด server
----------------------- */

app.listen(3000,()=>{

console.log("Server running http://localhost:3000")

})