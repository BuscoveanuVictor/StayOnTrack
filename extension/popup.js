// document.addEventListener('DOMContentLoaded', () => {
//     console.log("Script loaded!");
  
//     document.querySelectorAll('button').forEach(btn => {
//       btn.addEventListener('click', () => {
//         alert(`Ai apăsat: ${btn.innerText}`);
//       });
//     });
//   });


document.addEventListener('DOMContentLoaded', () => {

    btnBlock.addEventListener('click', () => {
        iframe.src = "templates/block_sites.html";
    });

    btnFocus.addEventListener('click', () => {
        iframe.src = "templates/focus_mode.html";
    });

    btnTasks.addEventListener('click', () => {
        iframe.src = "templates/tasks.html";
    });
});
