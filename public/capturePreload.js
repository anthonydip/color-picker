const { ipcRenderer } = require("electron");

// Listen for mouse movement in capture window
document.addEventListener('mousemove', (event) => {
  ipcRenderer.send('capture-mouse-move', "mouse moved");
});

// Listen for escape key press in capture window
document.addEventListener('keydown', (event) => {
  if(event.key === "Escape") {
    ipcRenderer.send('capture-escape-pressed', "escape pressed");
  }
});