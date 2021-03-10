// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const { openUrlMenuItem, openNewGitHubIssue, debugInfo } = require('electron-util');
const path = require("path");

if (require('electron-squirrel-startup')) return;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: app.name,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("renderer/views/index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const io = require("./main/io");

// listen to file(s) add event
ipcMain.handle("app:on-file-add", (event, files = []) => {
  io.addFiles(files);
});
// listen
ipcMain.handle("app:on-key-add", (event, name, private, public) => {
  io.addKey(name, private, public);
});
// return list of keys
ipcMain.handle("app:get-keys", () => {
  return io.getKeys();
});
//
ipcMain.handle("app:download-public-key", (event, private) => {
  io.downloadPublicKey(private);
});

const menuTemplate = Menu.buildFromTemplate([
  {
    role: 'fileMenu'
  },
  {
    role: 'editMenu'
  },
  {
  	role: 'viewMenu'
  },
  {
  	label: 'Help',
    submenu: [
      openUrlMenuItem({
        label: 'Website',
        url: 'https://techslayers.com'
      }),
      openUrlMenuItem({
        label: 'Source Code',
        url: 'https://github.com/tech-slayers/desktopgpg'
      }),
      {
        label: 'Open an Issue on GitHub',
        click() {
          const body =
`<!--- Provide a general summary of the issue in the Title above -->

## Description
<!--- Provide a more detailed introduction to the issue itself, and why you consider it to be a bug -->

## Expected Behavior
<!--- Tell us what should happen -->

## Actual Behavior
<!--- Tell us what happens instead -->

## Possible Fix
<!--- Not obligatory, but suggest a fix or reason for the bug -->

## Steps to Reproduce
<!--- Provide a link to a live example, or an unambiguous set of steps to -->
<!--- reproduce this bug. Include code to reproduce, if relevant -->
1.
2.
3.
4.

## Context
<!--- How has this bug affected you? What were you trying to accomplish? -->

**Screenshots**
If applicable, add screenshots to help explain your problem.



**Debug Information:**
${debugInfo()}`;
          openNewGitHubIssue({
            user: 'tech-slayers',
            repo: 'desktopgpg',
            assignee: 'AustinCasteel',
            body
          });
        },
      },
      {
        type: 'separator'
      },
      {
        role: 'reload'
      },
      {
        role: 'forceReload'
      },
      {
        role: 'toggleDevTools'
      },
    ],
  },
]);

Menu.setApplicationMenu(menuTemplate);