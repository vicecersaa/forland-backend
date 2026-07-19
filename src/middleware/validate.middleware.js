import deleteUploadedFiles from "../utils/deleteUploadedFiles.js";

const validate = (schema) => (req, res, next) => {

    try {

        req.body = schema.parse(req.body);

        next();

    } catch (error) {

        deleteUploadedFiles(req.files);

        next(error);

    }

};

export default validate;