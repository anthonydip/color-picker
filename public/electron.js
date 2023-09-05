const electron = require("electron");
const { app, Menu, Tray, BrowserWindow, globalShortcut, ipcMain, ipcRenderer, screen } = require("electron");
const { createCaptureWindow } = require("./capture.js");
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
    }
    else {
      event.preventDefault();
      mainWindow.hide();
    }
  });
};

app.on("ready", () => {

});


app.whenReady().then(() => {
  tray = new Tray('./public/favicon.ico');
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Capture Image (Ctrl+Shift+X)',
      click: () => {
        if(captureWindow === null) {
          captureWindow = createCaptureWindow();
        }
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
    if(captureWindow === null) {
      captureWindow = createCaptureWindow();
    }
  });

  // Register a 'CommandOrControl+Shift+X' shortcut listener for screen capture
  const ret = globalShortcut.register('CommandOrControl+Shift+X', () => {
    if(captureWindow === null) {
      captureWindow = createCaptureWindow();
    }
  });

  if(!ret) {
    console.log("registration failed");
  }

  // console.log(globalShortcut.isRegistered('CommandOrControl+Shift+X'));
});

// Hide capture window on escape pressed when focused
ipcMain.on('capture-escape-pressed', (event, arg) => {
  captureWindow.close();
  captureWindow = null;
});


// Capture mouse movement in capture window
ipcMain.on('capture-mouse-move', (event, arg) => {
  const point = screen.getCursorScreenPoint();
  // console.log(point);
});

// Start capture selection on mouse down in capture window
ipcMain.on('capture-mouse-down', (event, arg) => {
  // console.log("start capture");
  startCapture = screen.getCursorScreenPoint();
});

// End capture selection on mouse up in capture window
ipcMain.on('capture-mouse-up', (event, arg) => {
  endCapture = screen.getCursorScreenPoint();

  console.log("CAPTURE FROM: ", startCapture, " TO: ", endCapture);
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