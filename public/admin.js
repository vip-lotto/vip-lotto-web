async function save(){

const number = document.getElementById("number").value
const date = document.getElementById("date").value
const spinStart = document.getElementById("spinStart").value
const drawTime = document.getElementById("drawTime").value

await fetch("/api/save",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
number,
date,
spinStart,
drawTime
})

})

alert("บันทึกแล้ว")
loadHistory()

}