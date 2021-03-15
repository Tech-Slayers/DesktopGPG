$("#encrypt-btn-main").on("click", function() {
  //$("#encrypt-btn-clicked").trigger("click");
  window.location.replace("./encrypt.html");
});
$("#encrypt-btn-clicked").change(function(){
  window.location.replace("./encrypt.html");
});
$("#decrypt-btn-main").on("click", function() {
  //$("#decrypt-btn-clicked").trigger("click");
  window.location.replace("./decrypt.html");
});
$("#decrypt-btn-clicked").change(function(){
  // var file = $("#decrypt-btn-clicked").val();
  // window.location.replace("./decrypt.html?file=" + file);
  window.location.replace("./decrypt.html");
});
$("#new_pair-btn-main").on("click", function() {
  window.location.replace("./new_pair.html");
});
$("#import-btn-main").on("click", function() {
  //$("#import-btn-clicked").trigger("click");
  window.location.replace("./import.html");
});
$("#import-btn-clicked").change(function(){
  window.location.replace("./import.html");
});
$("#export-btn-main").on("click", function() {
  window.location.replace("./export.html");
});

$("#tablesearch").keyup(function () {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("tablesearch");
  filter = input.value.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
});








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
