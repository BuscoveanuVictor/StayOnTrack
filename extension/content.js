// Content.js este injectat in fiecare pagina web

// Si asculta mesajele de la pagina web pentru actualizare(update local storage etc.)
// deci e un middle man intre pagina web si extensie

const WEB_URL = "http://localhost:3000";
window.addEventListener('message', (event) => {
    
    if (event.data.type === 'update-block-list-data'){
        chrome.storage.sync.set({ blockList : event.data.list }, () => {
            console.log("Sync storage updated!");
        });
    }

    if (event.data.type === 'update-task-list-data'){
        chrome.storage.sync.set({ taskList : event.data.list }, () => {
            console.log("Sync storage updated!");
        });
    }

    if (event.data.type === 'update-allow-list-data'){
        chrome.storage.sync.set({ allowList : event.data.list }, () => {
            console.log("Sync storage updated!");
        });
    }

    if (event.data.type === 'SET_MODE'){
        chrome.storage.sync.set({ mode : event.data.mode }, () => {
            console.log("Sync storage updated!");
        });
    }

});
