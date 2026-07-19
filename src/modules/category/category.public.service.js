import Category from "./category.model.js";
import ApiError from "../../utils/ApiError.js";

const getAll = async () => {

    const categories = await Category.find({
        isActive: true
    })
        .select("-createdAt -updatedAt -__v")
        .sort({
            sortOrder: 1
        });

    return categories;

};

const getBySlug = async (slug) => {

    const category = await Category.findOne({
        slug,
        isActive: true
    }).select("-createdAt -updatedAt -__v");

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return category;

};

export default {
    getAll,
    getBySlug
};