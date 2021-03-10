# DesktopGPG

**Instructions.**

npm install && npm run start

**Publish.**

npm run make

## Contents

The application must be cross-platform.

The main function of the application is to manage gpg keys and easily decrypt files.

The private key is stored in the application and is used to decrypt files that were encrypted using the public key.

The public key should be download able as a file so that it can be easily shared.

The application should act as a viewer for decrypted data and should hold decrypted data in memory until a request is made to save it to a file.

If the decrypted data is not saved to a file it should be discarded.

The application should be password protected.