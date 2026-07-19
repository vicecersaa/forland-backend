import fs from "fs";
import path from "path";

const deleteFile = (folder, filename) => {

    if (!filename) return;

    const filePath = path.join(
        process.cwd(),
        "uploads",
        folder,
        filename
    );

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

};

export default deleteFile;