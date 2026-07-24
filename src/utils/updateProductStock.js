import Product from "../modules/product/product.model.js";


const updateProductStock = async (productId) => {

    const product = await Product.findById(productId);


    if (!product) {
        return;
    }


    let totalStock = 0;


    if (product.variants.length) {


        product.variants.forEach((variant) => {


            if (!variant.isActive) return;


            if (!variant.sizes.length) {


                totalStock += variant.stock || 0;


                return;

            }


            variant.sizes.forEach((size) => {


                if (!size.isActive) return;


                totalStock += size.stock || 0;


            });


        });


    } else {


        totalStock = product.stock || 0;


    }



    await Product.updateOne(

        {
            _id: productId
        },

        {
            totalStock
        }

    );


};


export default updateProductStock;