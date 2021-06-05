$("#SEF-cancel-btn").on("click", function() {
    window.location.replace("./index.html");
});

// $("#btn-export-key").on("click", function (e) {
//   e.preventDefault();

//   const keyFile = savedKeys.find((key) => key.name == $("#sel-keys").val());
//   if (!keyFile) {
//     alert("Please select a key pair from list");
//     return;
//   }
  
//   window.api.downloadPublicKey(keyFile.name);
// });

// $("#btn-show").on("click", function (e) {
//   e.preventDefault();

//   $("#decrypted").val(lastPlainFile.data);
// });

// $("#btn-save").on("click", function (e) {
//   e.preventDefault();

//   const element = document.createElement("a");
//   const file = new Blob([lastPlainFile.data], { type: "text/plain" });
//   element.href = URL.createObjectURL(file);
//   element.download = lastPlainFile.path;
//   element.click();
//   // $("#iframe").attr("src", lastPlainFile.path);
// });

// $("#btn-decrypt").on("click", function (e) {
//   e.preventDefault();

//   const keyFile =
//     savedKeys.find((key) => key.name == $("#sel-keys").val()) ??
//     document.getElementById("file-key").files[0];
//   if (!keyFile) {
//     alert("Please select a private key from list or import from file");
//     return;
//   }
//   console.log(keyFile);

//   const passphrase = $("#txt-passphrase").val();
//   if (!passphrase) {
//     alert("Please enter the key password");
//     return;
//   }
//   console.log(passphrase);

//   const encryptedFile = document.getElementById("file-encrypted").files[0];
//   if (!encryptedFile) {
//     alert("Please provide an encrypted file or paste in text box");
//     return;
//   }
//   console.log(encryptedFile);

//   const privateKeyType = getPrivateKeyType(keyFile);
//   if (privateKeyType < 0) {
//     alert(
//       "Unknown key file format. Please use *.key for binary or *.asc for armored ASCII"
//     );
//     return;
//   }
//   console.log(privateKeyType);

//   window.api.crypto
//     .decrypt(keyFile, privateKeyType == 0, passphrase, encryptedFile.path)
//     .then((plainFile) => {
//       console.log(plainFile);
//       lastPlainFile = plainFile;
//       alert("Data was decrypted successfully.");
//     })
//     .catch(alert);
// });

// function getPrivateKeyType(keyFile) {
//   let extension = keyFile.name.split(".").reverse()[0];
//   console.log(extension);
//   if (extension == "key") {
//     console.log("binary");
//     return 0;
//   } else if (extension == "asc") {
//     console.log("ascii");
//     return 1;
//   }
//   return -1;
// }

// function bindKeys(files = []) {
//   console.log(files.length);
//   $("#sel-keys").empty();
//   $("#sel-keys").append(new Option("Select a key.."));
//   savedKeys = files
//     .filter((file) => new RegExp("private|pvt").test(file.name))
//     .map(fileToKey);
//   savedKeys.forEach((key) => {
//     $("#sel-keys").append(new Option(key.title, key.name));
//   });
// }

// function fileToKey(file) {
//   let fileElements = file.name.split("-");
//   fileElements.pop();
//   return {
//     title: fileElements.join(" "),
//     name: file.name,
//     path: file.path,
//   };
// }

// let savedKeys = [];
// let lastPlainFile;
// let lastEncryptedMessage;

// window.api.onReloadKeys((args) => {
//   console.log("on Reload Keys");
//   window.api.listKeys().then(bindKeys).catch(alert);
// });

// (() => {
//   window.api.listKeys().then(bindKeys).catch(alert);
// })();

$("#btn-save").removeAttr("style").hide();
$("#pw").removeAttr("style").hide();
$("#processing").removeAttr("style").hide();

$("#sel-keys")
  .on("change", () => {
    const keyFile =
      savedKeys.find((key) => key.name == $("#sel-keys").val());
    if (!keyFile) {
      $("#txt-key-id").text("Key information");
      $("#txt-key-email").text(null);
      $("#txt-key-fp").text(null);
      return;
    }
    console.log(keyFile);

    const keyType = getKeyType(keyFile);
    if (keyType < 0) {
      alert(
        "Unknown key file format. Please use *.key for binary or *.asc for armored ASCII"
      );
      return;
    }

    window.api.key
      .readKeyFile(keyFile.path, keyType == 0)
      .then((privateKey) => {
        console.log(privateKey);
        const userInfo = privateKey.users[0].userId;
        $("#txt-key-id").text(userInfo.name);
        $("#txt-key-email").text(userInfo.email);
        const fingerprint = privateKey.keyPacket.fingerprint;
        const fpr = toHex(fingerprint).toUpperCase();
        $("#txt-key-fp").text(fpr.slice(0, 4) + ' ' + fpr.slice(4, 8) + ' ' + fpr.slice(8, 12) + ' ' + fpr.slice(12, 16) + ' ' + fpr.slice(16, 20) + ' ' + fpr.slice(20, 24) + ' ' + fpr.slice(24, 28) + ' ' + fpr.slice(28, 32) + ' ' + fpr.slice(32, 36) + ' ' + fpr.slice(36));
      })
      .catch(alert);

      $("#pw").show();
  });

$("#btn-export-key").on("click", (e) => {
  e.preventDefault();

  const keyFile = savedKeys.find((key) => key.name == $("#sel-keys").val());
  if (!keyFile) {
    alert("Please select a key pair from list");
    return;
  }

  window.api.downloadPublicKey(keyFile.name);
});

$("#btn-decrypt").on("click", function (e) {
  e.preventDefault();

  const keyFile =
    savedKeys.find((key) => key.name == $("#sel-keys").val());
  if (!keyFile) {
    alert("Please select a private key from list or import from file");
    return;
  }
  console.log(keyFile);

  const keyType = getKeyType(keyFile);
  if (keyType < 0) {
    alert(
      "Unknown key file format. Please use *.key for binary or *.asc for armored ASCII"
    );
    return;
  }

  const passphrase = $("#txt-passphrase").val();
  if (!passphrase) {
    alert("Please enter the key password");
    return;
  }
  console.log(passphrase);

  const encFile = document.getElementById("file-encrypted").files[0];
  // const encMessage = $("#txt-encrypted").val();
  if (encFile) {
    $("#btn-decrypt").removeAttr("style").hide();
    $("#btn-save").removeAttr("style").hide();
    $("#processing").show();
    console.log(encFile);
    window.api.crypto
      .decryptFile(keyFile.path, keyType == 0, passphrase, encFile.path)
      .then((plainFile) => {
        console.log(plainFile);
        lastPlainMessage = plainFile;
        alert("File was decrypted successfully. Remember to Save it!");
        $("#btn-save").show();
        $("#processing").removeAttr("style").hide();
        $("#btn-decrypt").show();
      })
      .catch(alert);
    return;
  // } else if (encMessage && !encMessage.empty) {
  //   console.log(encMessage);
  //   window.api.crypto
  //     .decryptText(keyFile.path, keyType == 0, passphrase, encMessage)
  //     .then((plainMessage) => {
  //       console.log(plainMessage);
  //       lastPlainMessage = plainMessage;
  //       alert("Data was decrypted successfully.");
  //     })
  //     .catch(alert);
  //   return;
  } else {
    alert("Please provide an encrypted file or paste in text box");
    return;
  }
});

// $("#btn-show").on("click", function (e) {
//   e.preventDefault();

//   $("#txt-decrypted").val(lastPlainMessage.data);
// });

$("#btn-save").on("click", function (e) {
  e.preventDefault();

  const element = document.createElement("a");
  const file = new Blob([lastPlainMessage.data], { type: "application/zip" });
  element.href = URL.createObjectURL(file);
  element.download = lastPlainMessage.path ?? "Decrypted_Results.zip";
  element.click();
});

function getKeyType(keyFile) {
  let extension = keyFile.name.split(".").reverse()[0];
  console.log(extension);
  if (extension == "key") {
    console.log("binary");
    return 0;
  } else if (extension == "asc") {
    console.log("ascii");
    return 1;
  }
  return -1;
}

function bindKeys(files = []) {
  $("#sel-keys").empty();
  $("#sel-keys").append(new Option("Select a key.."));
  savedKeys = files
    .filter((file) => new RegExp("private|pvt").test(file.name))
    .map(fileToKey);
  savedKeys.forEach((key) => {
    $("#sel-keys").append(new Option(key.title, key.name));
  });
}

function fileToKey(file) {
  let fileElements = file.name.split("-");
  fileElements.pop();
  return {
    title: fileElements.join(" "),
    name: file.name,
    path: file.path,
  };
}

let savedKeys = [];
let lastPlainMessage;
let lastEncryptedMessage;

window.api.onReloadKeys((args) => {
  console.log("on Reload Keys");
  window.api.listKeys().then(bindKeys).catch(alert);
});

(() => {
  window.api.listKeys().then(bindKeys).catch(alert);
})();

function toHex(buffer) {
  return Array.prototype.map
    .call(buffer, (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}
