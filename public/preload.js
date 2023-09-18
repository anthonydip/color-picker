const { contextBridge, ipcRenderer } = require("electron");

// window.addEventListener("DOMContentLoaded", () => {
//   ipcRenderer.on("capture-complete", (event, data) => {
//     console.log("CAPTURE COMPLETED!");
//     document.getElementById("capture-image").src = data;
//     document.getElementById("test").innerText = "hello";
//   });
// });

// White-listed channels
const ipc = {
  'render': {
    // From render to main
    'send': [
      'main-minimize',
      'main-maximize',
      'main-close',
    ],
    // From main to render
    'receive': [
      'capture-image',
      'capture-dimensions',
    ],
    // From render to main and back to render
    'sendReceive': [],
    'removeAllListeners': [
      'capture-image'
    ]
  }
}

/**
 * Render --> Main
 * ---------------
 * Render:  window.ipcRender.send('channel', data); // Data is optional.
 * Main:    ipcMain.on('channel', (event, data) => { methodName(data); })
 *
 * Main --> Render
 * ---------------
 * Main:    windowName.webContents.send('channel', data); // Data is optional.
 * Render:  window.ipcRender.receive('channel', (data) => { methodName(data); });
 *
 * Render --> Main (Value) --> Render
 * ----------------------------------
 * Render:  window.ipcRender.invoke('channel', data).then((result) => { methodName(result); });
 * Main:    ipcMain.handle('channel', (event, data) => { return someMethod(data); });
 *
 * Render --> Main (Promise) --> Render
 * ------------------------------------
 * Render:  window.ipcRender.invoke('channel', data).then((result) => { methodName(result); });
 * Main:    ipcMain.handle('channel', async (event, data) => {
 *              return await promiseName(data)
 *                  .then(() => { return result; })
 *          });
 */
contextBridge.exposeInMainWorld(
  'ipcRender', {
    // From renderer to main
    send: (channel, args) => {
      let validChannels = ipc.render.send;
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, args);
      }
    },
    // From main to renderer
    receive: (channel, listener) => {
      let validChannels = ipc.render.receive;
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => listener(...args));
      }
    },
    // From renderer to main and back to renderer
    invoke: (channel, args) => {
      let validChannels = ipc.render.sendReceive;
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, args);
      }
    },
    removeAllListeners: (channel) => {
      let validChannels = ipc.render.removeAllListeners;
      if (validChannels.includes(channel)) {
        return ipcRenderer.removeAllListeners(channel);
      }
    }
  }
);