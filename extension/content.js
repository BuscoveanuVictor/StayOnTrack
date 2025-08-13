// Asculta mesaje de la pagina web pentru actualizare
window.addEventListener('message', (event) => {
    if (event.data.type === 'UPDATE_BLOCK_LIST'){
        chrome.storage.sync.set({ blockList : event.data.blockList }, () => {
            console.log("Block list salvat în sync storage!");
        });
    }
    if (event.data.type === 'UPDATE_TASK_LIST'){
        console.log(event.data.taskList)
        chrome.storage.sync.set({ taskList : event.data.taskList }, () => {
            console.log("Task list salvat în sync storage!");
        });
    }
});