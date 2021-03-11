$("#btn-export-key").on("click", function (e) {
  e.preventDefault();

  const keyFile = savedKeys.find((key) => key.name == $("#sel-keys").val());
  if (!keyFile) {
    alert("Please select a key pair from list");
    return;
  }
  
  window.api.downloadPublicKey(keyFile.name);
});

$("#btn-show").on("click", function (e) {
  e.preventDefault();

  $("#decrypted").val(lastPlainFile.data);
});

$("#btn-save").on("click", function (e) {
  e.preventDefault();

  const element = document.createElement("a");
  const file = new Blob([lastPlainFile.data], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = lastPlainFile.path;
  element.click();
  // $("#iframe").attr("src", lastPlainFile.path);
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

(() => {
  window.api.listKeys().then(bindKeys).catch(alert);
})();
