const electron = require("electron");
const { app, Menu, Tray } = require("electron");
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({ width: 900, height: 680 });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("close", (event) => {
    if(app.quitting) {
      mainWindow = null;
    }
    else {
      event.preventDefault();
      if(!mainWindow || mainWindow.isDestroyed()) {
        console.log("here");
      }
      mainWindow.hide();
    }
  });
};

app.on("ready", createWindow);

let tray = null;
app.whenReady().then(() => {
  tray = new Tray('./public/favicon.ico');
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ]);
  tray.setContextMenu(contextMenu);

  tray.setToolTip('Color Picker');

  tray.on('click', () => {
    mainWindow.show();
  });
});

app.on("window-all-closed", () => {
  // if(process.platform !== "darwin") {
  //   app.quit();
  // }
});

app.on("activate", () => {
  mainWindow.show();
  // if (mainWindow === null) {
  //   createWindow();
  // }
  // else {
  //   mainWindow.show();
  // }
});

app.on('before-quit', () => {
  app.quitting = true;
});