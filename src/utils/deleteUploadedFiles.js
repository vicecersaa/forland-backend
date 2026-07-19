import fs from "fs";

const deleteUploadedFiles = (files = {}) => {

    Object.values(files)
        .flat()
        .forEach(file => {

            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

        });

};

export default deleteUploadedFiles;