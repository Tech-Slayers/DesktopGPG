const fs = require("fs");
const openpgp = require("openpgp");

module.exports = {
  encryptText: async (publicKeyArmored, text) => {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    return openpgp.encrypt({
      message: openpgp.Message.fromText(text), // input as Message object
      publicKeys: publicKey, // for encryption
    });
  },

  decryptText: async (privateKeyArmored, passphrase, encrypted) => {
    console.log("before privateKey");
    const privateKey = await openpgp.readKey({ armoredKey: privateKeyArmored });
    console.log(" privateKey");
    await privateKey.decrypt(passphrase);
    console.log("after privateKey");

    const message = await openpgp.readMessage({
      armoredMessage: encrypted, // parse armored message
    });
    const { data: decrypted } = await openpgp.decrypt({
      message,
      privateKeys: privateKey, // for decryption
    });
    console.log(decrypted); // 'Hello, World!'
    return decrypted;
  },

  decrypt: async (keyFile, isBinary, passphrase, fileEncrypted) => {
    console.log("before privateKey");
    const privateKeyData = fs.readFileSync(keyFile.path);
    const privateKey = isBinary
      ? await openpgp.readKey({
          binaryKey: privateKeyData,
        })
      : await openpgp.readKey({
          armoredKey: privateKeyData,
        });
    console.log(" privateKey");
    await privateKey.decrypt(passphrase);
    console.log("after privateKey");

    console.log(fileEncrypted);
    const encryptedData = fs.readFileSync(fileEncrypted);
    //   console.log(encryptedData);
    const message = await openpgp.readMessage({
      binaryMessage: encryptedData, //fs.createReadStream(fileEncrypted),
    });
    return openpgp.decrypt({ message, privateKeys: privateKey });
  },
};
