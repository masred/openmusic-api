/* eslint-disable no-unused-vars */
const fs = require('fs');

class StorageService {
  constructor(folder) {
    this.folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, id, name) {
    const hapiMeta = file.hapi;
    const fileExtension = hapiMeta.filename.match(/\.[0-9a-z]+$/i)[0];
    const filename = `${id}_${name}${fileExtension}`;
    const path = `${this.folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));

      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;
