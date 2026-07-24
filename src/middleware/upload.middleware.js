import multer from "multer";

import ApiError from "../utils/ApiError.js";
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


    const storage = multer.memoryStorage();



    const fileFilter = (
        req,
        file,
        cb
    ) => {


        const config = configs.find(

            item =>
                item.field === file.fieldname

        );


        if (!config) {

            return cb(

                new ApiError(
                    400,
                    "Invalid upload field"
                )

            );

        }



        if (config.type === "image") {


            if (
                !IMAGE_MIME_TYPES.includes(
                    file.mimetype
                )
            ) {

                return cb(

                    new ApiError(
                        400,
                        "Only JPG, JPEG, PNG and WEBP images are allowed."
                    )

                );

            }


        }




        if (config.type === "video") {


            if (
                !VIDEO_MIME_TYPES.includes(
                    file.mimetype
                )
            ) {

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


        fileSize:
            Math.max(
                IMAGE_MAX_SIZE,
                VIDEO_MAX_SIZE
            )


    };




    const multerUpload = multer({

        storage,

        fileFilter,

        limits

    }).fields(fields);





    return (
        req,
        res,
        next
    ) => {

        

        multerUpload(

            req,

            res,

            (err) => {


                if (err) {

                    return next(err);

                }



                try {


                    validateUploadedFiles(

                        req.files ?? {},

                        configs

                    );



                } catch(error) {


                    return next(error);


                }



                next();


            }

        );


    };


};


export default upload;