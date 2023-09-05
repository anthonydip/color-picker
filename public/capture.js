const { BrowserWindow } = require("electron");
const path = require("path");

let captureWindow = null;

// Create capture window to allow screenshotting a portion of the screen
const createCaptureWindow = () => {
  // Require screen module when app is ready
  const { screen } = require("electron");

  // Create a window that fills the screen's available work area
  // TODO: Needs to stretch across multiple monitors
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  captureWindow = new BrowserWindow({ 
    width, 
    height, 
    resizable: false,
    frame: false, 
    // opacity: 0.01,
    alwaysOnTop: true, // SET TO TRUE LATER
    skipTaskbar: true, // SET TO TRUE LATER
    movable: false,
    fullscreen: true,
    transparent: true,
    webPreferences: { 
      preload: path.join(__dirname, "capturePreload.js"),
      nodeIntegration: true 
    } 
  });

  captureWindow.on("close", (event) => {
    captureWindow = null;
  });

  captureWindow.loadURL(path.join(__dirname, "captureIndex.html"));
  // captureWindow.webContents.openDevTools();

  return captureWindow;
}

module.exports = {
  createCaptureWindow
};