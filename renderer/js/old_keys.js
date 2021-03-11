$("#private-cpy-btn").removeAttr("style").hide();
$("#public-cpy-btn").removeAttr("style").hide();
$("#fingerprint-cpy-btn").removeAttr("style").hide();

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
      });
  }
  $("#private-cpy-btn").show();
  $("#public-cpy-btn").show();
  $("#fingerprint-cpy-btn").show();
});

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