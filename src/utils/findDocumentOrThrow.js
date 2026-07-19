import ApiError from "./ApiError.js";

const findDocumentOrThrow = async (
    model,
    id,
    message = "Data not found"
) => {
    const document = await model.findById(id);

    if (!document) {
        throw new ApiError(404, message);
    }

    return document;
};

export default findDocumentOrThrow;