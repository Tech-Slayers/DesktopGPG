const { app, dialog } = require("electron");
const fs = require("fs-extra");
const path = require("path");

// local dependencies
const notification = require("./notification");

const userData = app.getPath("userData");
fs.ensureDirSync(userData);
const keysDir = path.resolve(userData, "keys");
fs.ensureDirSync(keysDir);

// add files
exports.addFiles = (files = []) => {
  console.log("addFiles");
  console.log(files);
  // copy `files` recursively (ignore duplicate file names)
  files.forEach((file) => {
    const filePath = path.resolve(keysDir, file.name);

    if (!fs.existsSync(filePath)) {
      fs.copyFileSync(file.path, filePath);
    }
  });

  // display notification
  notification.filesAdded(files.length);
};

// add key pair
exports.addKey = (name, private, public) => {
  const privatePath = path.resolve(keysDir, `${name}-private.asc`);
  const publicPath = path.resolve(keysDir, `${name}-public.asc`);

  if (!fs.existsSync(privatePath)) {
    fs.writeFileSync(privatePath, private);
  }

  if (!fs.existsSync(publicPath)) {
    fs.writeFileSync(publicPath, public);
  }

  // display notification
  notification.filesAdded(2);
};

// get the list of keys
exports.getKeys = () => {
  const files = fs.readdirSync(keysDir);

  return files
    .filter((file) => [".asc", ".key"].includes(path.extname(file)))
    .map((filename) => {
      const filePath = path.resolve(keysDir, filename);
      const fileStats = fs.statSync(filePath);
      return {
        name: filename,
        path: filePath,
        size: Number(fileStats.size / 1000).toFixed(1), // kb
      };
    });
};

exports.downloadPublicKey = (privateKeyName) => {
  const files = fs.readdirSync(keysDir);
  const publicKeyFile = files.find((filename) => {
    const nameElements = privateKeyName.split("-").pop();
    console.log(nameElements);
    const publicName = nameElements.startsWith("private")
      ? privateKeyName.replace("private", "public")
      : nameElements.startsWith("pvt")
      ? privateKeyName.replace("pvt", "pub")
      : privateKeyName;
    console.log(publicName);
    return publicName == filename;
  });
  console.log(publicKeyFile);
  try {
    const filePath = path.resolve(keysDir, publicKeyFile);
    const keyContent = fs.readFileSync(filePath);
    dialog.showSaveDialog(
      { defaultPath: publicKeyFile },
      keyContent,
      console.log
    );
  } catch (err) {
    console.log(err);
    dialog.showErrorBox("app", "Unable to find public key file.");
  }
};
