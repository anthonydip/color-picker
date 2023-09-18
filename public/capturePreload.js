const { ipcRenderer } = require("electron");

// Listen for escape key press in capture window
document.addEventListener('keydown', (event) => {
  if(event.key === "Escape") {
    ipcRenderer.send('capture-escape-pressed', "escape pressed");
  }
});

// Listen for mouse down to start capture selection
document.addEventListener('mousedown', (event) => {
  ipcRenderer.send('capture-mouse-down', "mouse down");
});

// Listen for mouse up to end capture selection
document.addEventListener('mouseup', (event) => {
  ipcRenderer.send('capture-mouse-up', "mouse up");
});