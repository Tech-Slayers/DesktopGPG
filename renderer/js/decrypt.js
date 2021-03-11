$("#SEF-cancel-btn").on("click", function() {
    window.location.replace("./index.html");
});

//$("#2").removeAttr("style").hide();

//$("#btn-import-key").on("click", function() {
//    $("#1").removeAttr("style").hide();
//    $("#2").show();
//});

// var qsParm = new Array();
// var query = window.location.search.substring(1);
// var parms = query.split('&');
// for (var i=0; i < parms.length; i++) {
//     var pos = parms[i].indexOf('=');
//     if (pos > 0) {
//         var key = parms[i].substring(0, pos);
//         var val = parms[i].substring(pos + 1);
//         qsParm[key] = val;
//         $("#file-encrypted").val(val);
//     }
// }

$("#btn-import-key").on("click", function (e) {
    e.preventDefault();
  
    const pvtFile = document.getElementById("file-pvt-key").files[0];
    console.log(pvtFile);
    const pubFile = document.getElementById("file-pub-key").files[0];
    console.log(pvtFile);
  
    const _files = [pvtFile, pubFile].map((file) => {
      return {
        name: file.name,
        path: file.path,
      };
    });
  
    window.api.copyFiles(_files);
  });

$("#btn-decrypt").on("click", function (e) {
    e.preventDefault();
  
    const keyFile =
      savedKeys.find((key) => key.name == $("#sel-keys").val()) ??
      document.getElementById("file-key").files[0];
    if (!keyFile) {
      alert("Please select a private key from list or import from file");
      return;
    }
    console.log(keyFile);
  
    const passphrase = $("#txt-passphrase").val();
    if (!passphrase) {
      alert("Please enter the key password");
      return;
    }
    console.log(passphrase);
  
    const encryptedFile = document.getElementById("file-encrypted").files[0];
    if (!encryptedFile) {
      alert("Please provide an encrypted file or paste in text box");
      return;
    }
    console.log(encryptedFile);
  
    const privateKeyType = getPrivateKeyType(keyFile);
    if (privateKeyType < 0) {
      alert(
        "Unknown key file format. Please use *.key for binary or *.asc for armored ASCII"
      );
      return;
    }
    console.log(privateKeyType);
  
    window.api.crypto
      .decrypt(keyFile, privateKeyType == 0, passphrase, encryptedFile.path)
      .then((plainFile) => {
        console.log(plainFile);
        lastPlainFile = plainFile;
        alert("Data was decrypted successfully.");
      })
      .catch(alert);
});

function getPrivateKeyType(keyFile) {
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
  console.log(files.length);
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
let lastPlainFile;

window.api.onReloadKeys((args) => {
  console.log("on Reload Keys");
  window.api.listKeys().then(bindKeys).catch(alert);
});

(() => {
  window.api.listKeys().then(bindKeys).catch(alert);
})();
