const fs = require("fs");
const path = require("path");
const mainFolderPath =
    "C:\\Users\\Raed Al-Masri\\Documents\\02.Flow English.traidnt.net-20230919T094751Z-001\\02.Flow English.traidnt.net";

fs.readdir(mainFolderPath, (err, folders) => {
    if (err) throw new Error(err);

    folders.forEach((folder) => {
        const folderPath = path.join(mainFolderPath, folder);

        fs.stat(folderPath, (err, stats) => {
            if (err) throw new Error(err);

            if (stats.isDirectory()) {
                fs.readdir(folderPath, (err, files) => {
                    if (err) throw new Error(err);

                    files.forEach((file) => {
                        const filePath = path.join(folderPath, file);
                        const { name, ext } = path.parse(filePath);

                        if (ext === ".mp4" || ext === ".mp3") {
                            fs.readFile(filePath, (err, data) => {
                                if (err) throw new Error(err);

                                const fileSize = data.length;

                                if (fileSize > 10 * 1024 * 1024) {
                                    const chunkSize = Math.ceil(fileSize / 4);
                                    const chunks = [];

                                    for (
                                        let i = 0;
                                        i < fileSize;
                                        i += chunkSize
                                    ) {
                                        chunks.push(
                                            data.slice(i, i + chunkSize)
                                        );
                                    }

                                    chunks.forEach((chunk, index) => {
                                        const chunkFilePath = path.join(
                                            folderPath,
                                            `#__${index + 1} ${name}.mp3`
                                        );
                                        fs.writeFile(
                                            chunkFilePath,
                                            chunk,
                                            (err) => {
                                                if (err) console.error(err);
                                            }
                                        );
                                    });

                                    console.log(
                                        `File ${name}.mp4 distributed successfully ✅`
                                    );
                                }
                            });
                        }
                    });
                });
            }
        });
    });
});
