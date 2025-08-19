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

    if(event.data.type === 'get-block-list-data'){
        chrome.storage.sync.get(['blockList'], (data) => {
            console.log("Sent sync storage data...")
            window.postMessage({ type: 'block-list-data', list: data.blockList || [] }, WEB_URL);
        });
    }

    if (event.data.type === 'update-task-list-data'){
        chrome.storage.sync.set({ taskList : event.data.list }, () => {
            console.log("Sync storage updated!");
        });
    }

    if(event.data.type === 'get-task-list-data'){
        chrome.storage.sync.get(['taskList'], (data) => {
            console.log("Sent sync storage data...")
            window.postMessage({ type: 'task-list-data', list: data.taskList || [] }, WEB_URL);
        });
    }

});
