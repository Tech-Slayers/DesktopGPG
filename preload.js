// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

process.once("loaded", () => {
  console.log("loaded");
});

const fs = require("fs");
const { contextBridge, ipcRenderer } = require("electron");
const key = require("./main/key");
const crypto = require("./main/crypto");

contextBridge.exposeInMainWorld("api", {
  readFileSync: fs.readFileSync,
  copyFiles: (files = []) => {
    ipcRenderer
      .invoke("app:on-file-add", files)
      .then(() => {
        console.log("files copied");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  writeKey: (name, private, public) => {
    ipcRenderer
      .invoke("app:on-key-add", name, private, public)
      .then(() => {
        console.log("keys added");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  listKeys: () => {
    return ipcRenderer.invoke("app:get-keys");
  },
  downloadPublicKey: (keyFile) => {
    return ipcRenderer.invoke("app:download-public-key", keyFile);
  },
  key: key,
  crypto: crypto,
});
