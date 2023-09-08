const electron = require("electron");
const { app, Menu, Tray, BrowserWindow, globalShortcut, ipcMain, desktopCapturer, screen, nativeImage, clipboard } = require("electron");
const Jimp = require("jimp");
const { createCaptureWindow } = require("./capture.js");
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow = null;
let captureWindow = null;
let tray = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({ 
    width: 900, 
    height: 680,
    show: false,
    // frame: false,
    // autoHideMenuBar: true,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: 'true',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    }
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.on("close", (event) => {
    if(app.quitting) {
      ipcMain.removeAllListeners();
      mainWindow = null;
      captureWindow = null;
    } else {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // const titleBarHack =
  //   'var div = document.createElement("div");' +
  //   'div.style.position = "absolute";' +
  //   'div.style.top = 0;' +
  //   'div.style.height = "33px";' +
  //   'div.style.width = "100%";' +
  //   'div.style["-webkit-app-region"] = "drag";' +
  //   'document.body.appendChild(div);';

  // mainWindow.webContents.on("did-finish-load", () => {
  //   mainWindow.webContents.executeJavaScript(titleBarHack);
  // });
};

app.on("ready", () => {
  createWindow();
});


app.whenReady().then(() => {
  const iconPath = path.join(__dirname, 'favicon.ico');
  tray = new Tray(iconPath);
  
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
        mainWindow.show();
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
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

  desktopCapturer
    .getSources({ 
      types: ["screen"],
      thumbnailSize: { width: 1920, height: 1080 }
    })
    .then((sources) => {
      let imageData = sources[0].thumbnail.toDataURL();

      let encodedImageBuffer = new Buffer.from(imageData.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

      Jimp.read(encodedImageBuffer, (err, image) => {
        if (err) throw err;

        console.log(image.bitmap.width, image.bitmap.height);

        const captureWidth = endCapture.x - startCapture.x;
        const captureHeight = endCapture.y - startCapture.y;

        image.crop(startCapture.x, startCapture.y, captureWidth, captureHeight);


        image.getBase64('image/jpeg', (err, base64data) => {
          if (err) throw err;

          // Create nativeImage and copy to clipboard
          console.log(base64data);
          const nImage = nativeImage.createFromBuffer(new Buffer.from(base64data.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64'));
          clipboard.writeImage(nImage);

          mainWindow.webContents.send('capture-image', base64data);
        });

      });

      // mainWindow.webContents.send('capture-image', image);
      // mainWindow.webContents.send('capture-boundaries', captureBounds);
    });

  // Close the capture window
  captureWindow.close();
  captureWindow = null;
});

// might not be needed?
ipcMain.on('capture-mouse-leave', (event, arg) => {
  // console.log("mouse left, closing");
  // captureWindow.close();
  // captureWindow = null;
});

// Minimize main window from titlebar
ipcMain.on('main-minimize', (event, arg) => {
  console.log("minimize main window!");
  mainWindow.minimize();
});

// Maximize main window from titlebar
ipcMain.on('main-maximize', (event, arg) => {
  console.log("maximize main window!");
  if(mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});

// Close/hide main window from titlebar
ipcMain.on('main-close', (event, arg) => {
  console.log("close main window!");
  mainWindow.hide();
});

app.on("window-all-closed", () => {
  // app.quit();
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