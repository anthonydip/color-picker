const electron = require("electron");
const { app, Menu, Tray, BrowserWindow, globalShortcut, ipcMain, screen } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow = null;
let captureWindow = null;
let tray = null;

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
      captureWindow = null;
    }
    else {
      event.preventDefault();
      mainWindow.hide();
    }
  });
};

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
    // transparent: true, // SET TO TRUE LATER?
    frame: false, 
    // opacity: 0.5,
    // alwaysOnTop: true, // SET TO TRUE LATER
    // skipTaskbar: true, // SET TO TRUE LATER
    webPreferences: { 
      preload: path.join(__dirname, "capturePreload.js"),
      nodeIntegration: true 
    } 
  });

  captureWindow.loadURL(path.join(__dirname, "captureIndex.html"));
  captureWindow.webContents.openDevTools();
}

// Capture mouse movement in capture window
ipcMain.on('capture-mouse-move', (event, arg) => {
  const point = screen.getCursorScreenPoint();
  console.log(point);
});

// Hide capture window on escape pressed when focused
ipcMain.on('capture-escape-pressed', (event, arg) => {
  captureWindow.hide();
});

app.on("ready", () => {

});


app.whenReady().then(() => {
  tray = new Tray('./public/favicon.ico');
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Capture Image (Ctrl+Shift+X)',
      click: () => {
        captureWindow === null ? createCaptureWindow() : captureWindow.show();
      }
    },
    {
      label: 'Show',
      click: () => {
        mainWindow === null ? createWindow() : mainWindow.show();
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ]);
  tray.setContextMenu(contextMenu);

  tray.setToolTip('Color Picker');

  // Show capture window on tray icon click
  tray.on('click', () => {
    captureWindow === null ? createCaptureWindow() : captureWindow.show();
  });

  // Register a 'CommandOrControl+Shift+X' shortcut listener for screen capture
  const ret = globalShortcut.register('CommandOrControl+Shift+X', () => {
    captureWindow === null ? createCaptureWindow() : captureWindow.show();
  });

  if(!ret) {
    console.log("registration failed");
  }

  // console.log(globalShortcut.isRegistered('CommandOrControl+Shift+X'));
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

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('CommandOrControl+Shift+X');
});

app.on('before-quit', () => {
  app.quitting = true;
});