import ApiError from "./ApiError.js";
import {
    IMAGE_MAX_SIZE,
    VIDEO_MAX_SIZE
} from "./fileValidation.js";

const validateUploadedFiles = (files, configs) => {

    Object.entries(files).forEach(([field, uploadedFiles]) => {

        const config = configs.find(
            item => item.field === field
        );

        if (!config) return;

        uploadedFiles.forEach(file => {

            if (
                config.type === "image" &&
                file.size > IMAGE_MAX_SIZE
            ) {
                throw new ApiError(
                    400,
                    `${field} exceeds 5 MB`
                );
            }

            if (
                config.type === "video" &&
                file.size > VIDEO_MAX_SIZE
            ) {
                throw new ApiError(
                    400,
                    `${field} exceeds 100 MB`
                );
            }

        });

    });

};

export default validateUploadedFiles;