const { ipcRenderer } = require("electron");

// Add event listener in capture window to listen for mouse movement
document.addEventListener('mousemove', (event) => {
  ipcRenderer.send('capture-mouse-move', "mouse moved");
});