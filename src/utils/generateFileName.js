import crypto from "crypto";
import path from "path";

const generateFileName = (originalName) => {
    const extension = path.extname(originalName);

    return `${Date.now()}-${crypto.randomUUID()}${extension}`;
};

export default generateFileName;