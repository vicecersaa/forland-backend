import Banner from "../banner/banner.model.js";
import Category from "../category/category.model.js";
import Product from "../product/product.model.js";

const getHome = async () => {

    const [

        banners,

        categories,

        newArrivals

    ] = await Promise.all([

        Banner.find({

            isActive: true

        })

        .sort({

            sortOrder: 1

        }),

        Category.find({

            isActive: true

        })

        .sort({

            sortOrder: 1

        })

        .select(

            "name slug image"

        ),

        Product.find({

            isActive: true

        })

        .select(

            "name slug thumbnail minPrice maxPrice category"

        )

        .populate(

            "category",

            "name slug"

        )

        .sort({

            createdAt: -1

        })

        .limit(8)

    ]);

    return {

        banners,

        categories,

        newArrivals

    };

};

export default {

    getHome

};