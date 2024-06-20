const fs = require("fs");
const path = require("path");

const renameFiles = (dir) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error stating file ${filePath}:`, err);
          return;
        }

        if (stats.isDirectory()) {
          renameFiles(filePath); // Recursively rename files in subdirectories
        } else if (stats.isFile()) {
          if (file.endsWith(".js")) {
            const newFilePath = filePath.replace(/\.js$/, ".ts");
            fs.rename(filePath, newFilePath, (err) => {
              if (err) {
                console.error(`Error renaming file ${filePath} to ${newFilePath}:`, err);
              } else {
                console.log(`Renamed ${filePath} to ${newFilePath}`);
              }
            });
          } else if (file.endsWith(".jsx")) {
            const newFilePath = filePath.replace(/\.jsx$/, ".tsx");
            fs.rename(filePath, newFilePath, (err) => {
              if (err) {
                console.error(`Error renaming file ${filePath} to ${newFilePath}:`, err);
              } else {
                console.log(`Renamed ${filePath} to ${newFilePath}`);
              }
            });
          }
        }
      });
    });
  });
};

// Replace '.' with the directory you want to start from
renameFiles("./client/src");
