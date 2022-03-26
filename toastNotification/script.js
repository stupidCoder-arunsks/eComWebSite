const btn = document.getElementById("btn");
const container = document.getElementById("container");

btn.addEventListener('click', ()=>{
  createNotification();
});

function createNotification(){
    console.log("hello");
    const notify = document.createElement("div");

    notify.classList.add("toast");

    notify.innerText = "This challenge is crazy!";
    container.append(notify);

    setTimeout(() => {
       notify.remove();
    },3000);

}