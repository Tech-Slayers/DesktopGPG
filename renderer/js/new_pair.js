$("#generated-save-btn").on("click", function() {
    var pvt_save = $.trim($("#txt-pvt-key").val());
    var pub_save = $.trim($('#txt-pub-key').val());
    var finger_save = $.trim($('#txt-fingerprint').val());
    const userName = $("#txt-full-name").val();
    const keyName = userName.replace(" ", "-");
    var zip = new JSZip();
    if($('#pvt-key-include').prop("checked") == true){
      zip.file(keyName+"-private.asc", pvt_save);
    }
    zip.file(keyName+"-public.asc", pub_save);
    zip.file(keyName+"-fingerprint.txt", finger_save);
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        saveAs(content, keyName+"-generated-keys.zip");
    });
});

$("#2-1").removeAttr("style").hide();
$("#2-2").removeAttr("style").hide();
$("#2-3").removeAttr("style").hide();

$("#SEF-cancel-btn").on("click", function() {
    window.location.replace("./index.html");
});

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
          const fpr = toHex(key.keyPacket.fingerprint).toUpperCase();
          const ffpr = "Fingerprint: " + fpr.slice(0, 4) + ' ' + fpr.slice(4, 8) + ' ' + fpr.slice(8, 12) + ' ' + fpr.slice(12, 16) + ' ' + fpr.slice(16, 20) + ' ' + fpr.slice(20, 24) + ' ' + fpr.slice(24, 28) + ' ' + fpr.slice(28, 32) + ' ' + fpr.slice(32, 36) + ' ' + fpr.slice(36);
          $("#txt-fingerprint").val(ffpr);
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
          var privateKeyArmored2 = $.trim($('#txt-pvt-key').val());
          var publicKeyArmored2 = $.trim($('#txt-pub-key').val());
          $("#txt-pvt-key").val(privateKeyArmored2);
          $("#txt-pub-key").val(publicKeyArmored2);
          const fpr = toHex(key.keyPacket.fingerprint).toUpperCase();
          const ffpr = fpr.slice(0, 4) + ' ' + fpr.slice(4, 8) + ' ' + fpr.slice(8, 12) + ' ' + fpr.slice(12, 16) + ' ' + fpr.slice(16, 20) + ' ' + fpr.slice(20, 24) + ' ' + fpr.slice(24, 28) + ' ' + fpr.slice(28, 32) + ' ' + fpr.slice(32, 36) + ' ' + fpr.slice(36);
          $("#txt-fingerprint").val(ffpr);
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
    alert("Copied the Fingerprint: " + copyText.value);
});

function toHex(buffer) {
  return Array.prototype.map
    .call(buffer, (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}