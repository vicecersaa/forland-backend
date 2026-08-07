import Coupon from "./coupon.model.js";
import ApiError from "../../utils/ApiError.js";
import queryBuilder from "../../utils/queryBuilder.js";
import paginate from "../../utils/paginate.js";

const create = async (payload) => {

    const exists = await Coupon.findOne({
        code: payload.code.toUpperCase()
    });

    if (exists) {
        throw new ApiError(400, "Coupon already exists");
    }

    payload.code = payload.code.toUpperCase();

    return await Coupon.create(payload);

};

const getAll = async (query) => {

    const {

        page,

        limit,

        skip,

        filter,

        sort

    } = queryBuilder(query, {

        searchableFields: [

            "code",

            "description"

        ]

    });

    const totalItems = await Coupon.countDocuments(filter);

    const items = await Coupon.find(filter)

        .sort(sort)

        .skip(skip)

        .limit(limit);

    return {

        items,

        pagination: paginate({

            page,

            limit,

            totalItems

        })

    };

};

const getPopup = async () => {
  const now = new Date();
  const coupon = await Coupon.findOne({
    isActive: true,
    isPopup: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });

  if (!coupon) return null;

  return {
    code: coupon.code,
    discount: coupon.value,
    label: coupon.label || "",
  };
};

const getById = async (id) => {

    const coupon = await Coupon.findById(id);

    if (!coupon) {

        throw new ApiError(

            404,

            "Coupon not found"

        );

    }

    return coupon;

};

const update = async (id, payload) => {

    const coupon = await Coupon.findById(id);

    if (!coupon) {

        throw new ApiError(

            404,

            "Coupon not found"

        );

    }

    if (payload.code) {

        payload.code = payload.code.toUpperCase();

        const exists = await Coupon.findOne({

            code: payload.code,

            _id: {

                $ne: id

            }

        });

        if (exists) {

            throw new ApiError(

                400,

                "Coupon code already exists"

            );

        }

    }

    Object.assign(

        coupon,

        payload

    );

    await coupon.save();

    return coupon;

};

const validateCoupon = async (payload) => {

    const coupon = await Coupon.findOne({

        code: payload.code.toUpperCase(),

        isActive: true

    });

    if (!coupon) {

        throw new ApiError(

            404,

            "Coupon not found"

        );

    }

    const now = new Date();

    if (coupon.startDate > now) {

        throw new ApiError(

            400,

            "Coupon is not active yet"

        );

    }

    if (coupon.endDate < now) {

        throw new ApiError(

            400,

            "Coupon has expired"

        );

    }

    if (

        coupon.usageLimit > 0 &&

        coupon.usedCount >= coupon.usageLimit

    ) {

        throw new ApiError(

            400,

            "Coupon usage limit reached"

        );

    }

    if (

        payload.subtotal < coupon.minimumPurchase

    ) {

        throw new ApiError(

            400,

            `Minimum purchase is ${coupon.minimumPurchase}`

        );

    }

    let discount = 0;

    if (coupon.type === "percentage") {

        discount =

            payload.subtotal *

            (coupon.value / 100);

        if (

            coupon.maximumDiscount > 0 &&

            discount > coupon.maximumDiscount

        ) {

            discount = coupon.maximumDiscount;

        }

    } else {

        discount = coupon.value;

    }

    if (discount > payload.subtotal) {

        discount = payload.subtotal;

    }

    return {

        valid: true,

        coupon: coupon.code,

        discount,

        total: payload.subtotal - discount

    };

};

const remove = async (id) => {

    const coupon = await Coupon.findById(id);

    if (!coupon) {

        throw new ApiError(

            404,

            "Coupon not found"

        );

    }

    coupon.isActive = false;

    await coupon.save();

};

export default {

    create,

    getAll,

    getById,

    update,

    validateCoupon,

    remove,

    getPopup
};