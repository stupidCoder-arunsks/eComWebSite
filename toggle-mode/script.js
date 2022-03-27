const toggle = document.getElementById("toggle");

toggle.addEventListener("change",(e) =>{
    document.body.classList.toggle("dark" , e.target.checked);
    console.log(e.target.checked);
});