const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.on("capture-complete", (event, data) => {
    console.log("CAPTURE COMPLETED!");
    document.getElementById("capture-image").src = data;
    document.getElementById("test").innerText = "hello";
  });
});