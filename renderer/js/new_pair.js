$("#generated-save-btn").on("click", function() {
    var pvt_save = $.trim($("#txt-pvt-key").val());
    var pub_save = $.trim($('#txt-pub-key').val());
    var finger_save = $.trim($('#txt-fingerprint').val());
    var zip = new JSZip();
    if($('#pvt-key-include').prop("checked") == true){
      zip.file("private-key.asc", pvt_save);
    }
    //zip.file("private-key.asc", pvt_save);
    zip.file("public-key.asc", pub_save);
    zip.file("fingerprint.txt", finger_save);
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        // see FileSaver.js
        saveAs(content, "generated-keys.zip");
    });
});

$("#2-1").removeAttr("style").hide();
$("#2-2").removeAttr("style").hide();
$("#2-3").removeAttr("style").hide();

$("#SEF-cancel-btn").on("click", function() {
    window.location.replace("./index.html");
});

// $("#btn-generate-key").on("click", function (e) {
//   e.preventDefault();
//   const passphrase = $("#txt-passphrase").val();
//   const userName = $("#txt-full-name").val();
//   const userEmail = $("#txt-email").val();
//   const keyType = $("input[name='key-type']:checked").val();
//   if (keyType == "ecc") {
//     window.api.key
//       .generateECC(passphrase, userName, userEmail)
//       .then((keyPair) => {
//         storeGeneratedKeyPair(userName, keyPair);
//       })
//       .catch(alert);
//   } else {
//     window.api.key
//       .generateRSA(passphrase, userName, userEmail)
//       .then((keyPair) => {
//         storeGeneratedKeyPair(userName, keyPair);
//       })
//       .catch(alert);
//   }
// });
// function storeGeneratedKeyPair(userName, keyPair) {
//   const { privateKeyArmored, publicKeyArmored, key } = keyPair;
//   const keyName = userName.replace(" ", "-");
//   console.log(keyName);
//   // Store keys
//   window.api
//     .writeKey(keyName, privateKeyArmored, publicKeyArmored)
//     .then(window.api.reloadKeys)
//     .catch(alert);
//   // Display on UI
//   var privateKeyArmored2 = $.trim(privateKeyArmored.val());
//   var publicKeyArmored2 = $.trim(publicKeyArmored.val());
//   $("#txt-pvt-key").val(privateKeyArmored2);
//   $("#txt-pub-key").val(publicKeyArmored2);
//   $("#1-1").removeAttr("style").hide();
//   $("#1-2").removeAttr("style").hide();
//   $("#2-1").show();
//   $("#2-2").show();
//   $("#2-3").show();
// }
$("#btn-generate-key").on("click", function (e) {
    e.preventDefault();
    const passphrase = $("#txt-passphrase").val();
    const userName = $("#txt-full-name").val();
    const userEmail = $("#txt-email").val();
    const keyType = $("input[name='key-type']:checked").val();
    if (keyType == "ecc") {
      window.api.key
        .generateECC(passphrase, userName, userEmail)
        .then((keyPair) => {
          const { privateKeyArmored, publicKeyArmored, key } = keyPair;
          $("#txt-private-key").val(privateKeyArmored);
          $("#txt-public-key").val(publicKeyArmored);
          const keyName = userName.replace(" ", "-");
          console.log(keyName);
          window.api.writeKey(keyName, privateKeyArmored, publicKeyArmored);
          var privateKeyArmored2 = $.trim($('#txt-pvt-key').val());
          var publicKeyArmored2 = $.trim($('#txt-pub-key').val());
          $("#txt-pvt-key").val(privateKeyArmored2);
          $("#txt-pub-key").val(publicKeyArmored2);
        });
    } else {
      window.api.key
        .generateRSA(passphrase, userName, userEmail)
        .then((keyPair) => {
          const { privateKeyArmored, publicKeyArmored, key } = keyPair;
          $("#txt-pvt-key").val(privateKeyArmored);
          $("#txt-pub-key").val(publicKeyArmored);
          const keyName = userName.replace(" ", "-");
          console.log(keyName);
          window.api.writeKey(keyName, privateKeyArmored, publicKeyArmored);
          //pvt_key = $.trim($("#txt-pvt-key").val());
          var privateKeyArmored2 = $.trim($('#txt-pvt-key').val());
          var publicKeyArmored2 = $.trim($('#txt-pub-key').val());
          $("#txt-pvt-key").val(privateKeyArmored2);
          $("#txt-pub-key").val(publicKeyArmored2);
        });
    }
    $("#1-1").removeAttr("style").hide();
    $("#1-2").removeAttr("style").hide();
    $("#2-1").show();
    $("#2-2").show();
    $("#2-3").show();
});

$("#private-cpy-btn").on("click", function (e) {
    e.preventDefault();
    var copyText = document.getElementById("txt-pvt-key");
    copyText.select();
    document.execCommand("copy");
    alert("Copied the key: " + copyText.value.substring(0,37));
});
$("#public-cpy-btn").on("click", function (e) {
    e.preventDefault();
    var copyText = document.getElementById("txt-pub-key");
    copyText.select();
    document.execCommand("copy");
    alert("Copied the key: " + copyText.value.substring(0,36));
});
$("#fingerprint-cpy-btn").on("click", function (e) {
    e.preventDefault();
    var copyText = document.getElementById("txt-fingerprint");
    copyText.select();
    document.execCommand("copy");
    alert("Copied the key: " + copyText.value.substring(0,36));
});