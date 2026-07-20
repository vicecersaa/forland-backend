import multer from "multer";
import path from "path";
import fs from "fs";

import ApiError from "../utils/ApiError.js";
import generateFileName from "../utils/generateFileName.js";
import deleteUploadedFiles from "../utils/deleteUploadedFiles.js";
import validateUploadedFiles from "../utils/validateUploadedFiles.js";

import {
    IMAGE_MIME_TYPES,
    VIDEO_MIME_TYPES,
    IMAGE_MAX_SIZE,
    VIDEO_MAX_SIZE
} from "../utils/fileValidation.js";

const upload = (configs) => {

    const fields = configs.map(config => ({
        name: config.field,
        maxCount: config.maxCount
    }));

    const storage = multer.diskStorage({

        destination(req, file, cb) {

            const config = configs.find(
                item => item.field === file.fieldname
            );

            if (!config) {
                return cb(new ApiError(400, "Invalid upload field"));
            }

            const uploadPath = path.join(
                process.cwd(),
                "uploads",
                config.folder
            );

            fs.mkdirSync(uploadPath, {
                recursive: true
            });

            cb(null, uploadPath);

        },

        filename(req, file, cb) {

            cb(
                null,
                generateFileName(file.originalname)
            );

        }

    });

    const fileFilter = (req, file, cb) => {

        const config = configs.find(
            item => item.field === file.fieldname
        );

        if (!config) {
            return cb(new ApiError(400, "Invalid upload field"));
        }

        if (config.type === "image") {

            if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {

                return cb(
                    new ApiError(
                        400,
                        "Only JPG, JPEG, PNG and WEBP images are allowed."
                    )
                );

            }

        }

        if (config.type === "video") {

            if (!VIDEO_MIME_TYPES.includes(file.mimetype)) {

                return cb(
                    new ApiError(
                        400,
                        "Only MP4, WEBM and MOV videos are allowed."
                    )
                );

            }

        }

        cb(null, true);

    };

    const limits = {

        fileSize: Math.max(
            IMAGE_MAX_SIZE,
            VIDEO_MAX_SIZE
        )

    };

   const multerUpload = multer({

    storage,

    fileFilter,

    limits

}).fields(fields);

return (req, res, next) => {

    multerUpload(req, res, (err) => {

        if (err) {

            deleteUploadedFiles(req.files);

            return next(err);

        }

        try {

            validateUploadedFiles(
                req.files ?? {},
                configs
            );

        } catch (error) {

            deleteUploadedFiles(req.files);

            return next(error);

        }

        next();

    });

};

return (req, res, next) => {

    multerUpload(req, res, (err) => {

        console.log("FIELDS CONFIG:", fields);

        if (err) {

            console.log(err);

            return next(err);

        }

        next();

    });

};

return (req, res, next) => {

    multerUpload(req, res, (err) => {

        if (err) {

            deleteUploadedFiles(req.files);

            return next(err);

        }

        try {

            validateUploadedFiles(
                req.files ?? {},
                configs
            );

        } catch (error) {

            deleteUploadedFiles(req.files);

            return next(error);

        }

        next();

    });

};

};

export default upload;