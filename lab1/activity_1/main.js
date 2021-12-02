    //alert(Date());
    function printCurrentDateTime(){
        console.time("timerName");
        console.log(Date());
        console.timeEnd("timerName");
    }
    let bar = document.getElementById("skill-html").querySelector(".bar");
    bar.style.width = "5%";
    let bars = document.getElementsByClassName("bar");
    for(let index = 0; index < bars.length; index++){
        bars[index].style.width = "50%"
    }
