let spinning = false

function randomDigit(){
    return Math.floor(Math.random()*10)
}

function spin(){

    if(!spinning) return

    for(let i=0;i<5;i++){
        document.getElementById("n"+i).innerText = randomDigit()
    }

}

setInterval(spin,80)


function convertTime(timeStr){

    if(timeStr.includes("PM") || timeStr.includes("AM")){

        const parts = timeStr.split(" ")
        const hm = parts[0].split(":")
        let h = parseInt(hm[0])
        const m = parseInt(hm[1])

        if(parts[1] === "PM" && h < 12) h += 12
        if(parts[1] === "AM" && h === 12) h = 0

        return {h,m}

    }

    const hm = timeStr.split(":")
    return {
        h:parseInt(hm[0]),
        m:parseInt(hm[1])
    }

}



async function check(){

 const res = await fetch("/api/data")
const data = await res.json()

let d = data.date.split("-")
let newDate = d[2] + "-" + d[1] + "-" + d[0]

document.getElementById("date").innerText = newDate;
document.getElementById("time").innerText = data.drawTime;

const now = new Date()

    const s = convertTime(data.spinStart)
   const drawTime = convertTime(data.drawTime)

    const start = new Date()
    start.setHours(s.h)
    start.setMinutes(s.m)
    start.setSeconds(0)

    const draw = new Date()
   draw.setHours(drawTime.h)
   draw.setMinutes(drawTime.m)
    draw.setSeconds(0)

    if(now < start){

        spinning = false

        for(let i=0;i<5;i++){
            document.getElementById("n"+i).innerText = 0
        }

    }

    else if(now >= start && now < draw){

        spinning = true

    }

    else{

        spinning = false

        const nums = data.number.split("")
for(let i=0;i<5;i++){
    document.getElementById("n"+i).innerText = nums[i]
}

document.getElementById("n5_table").innerText = data.number
document.getElementById("n4_table").innerText = data.number.slice(1)
document.getElementById("n3_table").innerText = data.number.slice(2)
document.getElementById("n2t").innerText = data.number.slice(0,2)
document.getElementById("n2b").innerText = data.number.slice(-2)
        }

    }

setInterval(check,1000)