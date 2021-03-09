const fs = require("fs");
const { readKey, generateKey, decryptKey } = require("openpgp");

module.exports = {
  readKey: readKey,

  readPrivateKey: async (privateKeyData, passphrase) => {
    const privateKey = await readKey({ binaryKey: privateKeyData });
    await privateKey.decrypt(passphrase);
    console.log(privateKey);
    return privateKey;
  },

  decryptKey: async (privateKey, passphrase) => {
    return await decryptKey({ privateKey, passphrase });
    //privateKey.decrypt(passphrase);
  },

  generateRSA: async (passphrase, name, email) => {
    return generateKey({
      type: "rsa", // Type of the key, defaults to ECC
      // curve: 'curve25519', // ECC curve name, defaults to curve25519
      rsaBits: 4096, // RSA key size (defaults to 4096 bits)
      userIds: [{ name, email }], // you can pass multiple user IDs
      passphrase, // protects the private key
    });
  },

  generateECC: async (passphrase, name, email) => {
    return generateKey({
      type: "ecc", // Type of the key, defaults to ECC
      curve: "p521", // ECC curve name, defaults to curve25519
      userIds: [{ name, email }], // you can pass multiple user IDs
      passphrase, // protects the private key
    });
  },
};
