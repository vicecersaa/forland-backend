import Product from "../product/product.model.js";
import Order from "../order/order.model.js";
import User from "../auth/user.model.js";

const getDashboard = async () => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);
    last7Days.setHours(0, 0, 0, 0);

    // ===========================
    // SUMMARY
    // ===========================

    const [

        totalProducts,

        totalCustomers,

        totalOrders,

        todayOrders,

        pendingOrders,

        lowStock,

        todayRevenue

    ] = await Promise.all([

        Product.countDocuments({
            isActive: true
        }),

        User.countDocuments({
            role: "user"
        }),

        Order.countDocuments(),

        Order.countDocuments({
            createdAt: {
                $gte: today
            }
        }),

        Order.countDocuments({
            status: "pending"
        }),

        Product.countDocuments({
            totalStock: {
                $lte: 5
            },
            isActive: true
        }),

        Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: today
                    },
                    paymentStatus: "paid"
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$total"
                    }
                }
            }
        ])

    ]);

    // ===========================
    // SALES CHART
    // ===========================

    const salesChartResult = await Order.aggregate([
    {
        $match: {
            createdAt: {
                $gte: last7Days
            },
            paymentStatus: "paid"
        }
    },
    {
        $group: {
            _id: {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt"
                }
            },
            revenue: {
                $sum: "$total"
            }
        }
    }
]);

const salesMap = {};

salesChartResult.forEach(item => {
    salesMap[item._id] = item.revenue;
});

const salesChart = [];

for (let i = 6; i >= 0; i--) {

    const date = new Date();

    date.setDate(date.getDate() - i);

    const key = date.toISOString().split("T")[0];

    salesChart.push({

        date: key,

        revenue: salesMap[key] || 0

    });

}

    // ===========================
    // ORDER STATUS
    // ===========================

    const orderStatusResult = await Order.aggregate([
    {
        $group: {
            _id: "$status",
            count: {
                $sum: 1
            }
        }
    }
    ]);

const statusMap = {
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0
};

orderStatusResult.forEach(item => {
    statusMap[item._id] = item.count;
});

const orderStatus = Object.entries(statusMap).map(([status, count]) => ({
    status,
    count
}));

    // ===========================
    // RECENT ORDERS
    // ===========================

    const recentOrders = await Order.find()

        .sort({
            createdAt: -1
        })

        .limit(5)

        .select(
            "orderNumber shippingAddress total status paymentStatus createdAt"
        );

    // ===========================
    // BEST SELLING PRODUCTS
    // ===========================

    const bestSellingProducts = await Order.aggregate([

        {
            $unwind: "$items"
        },

        {
            $group: {
                _id: "$items.product",
                name: {
                    $first: "$items.name"
                },
                thumbnail: {
                    $first: "$items.thumbnail"
                },
                sold: {
                    $sum: "$items.quantity"
                },
                revenue: {
                    $sum: "$items.subtotal"
                }
            }
        },

        {
            $sort: {
                sold: -1
            }
        },

        {
            $limit: 5
        }

    ]);

    return {

        summary: {

            todayRevenue: todayRevenue[0]?.total || 0,

            totalOrders,

            todayOrders,

            totalProducts,

            totalCustomers,

            pendingOrders,

            lowStock

        },

        salesChart,

        orderStatus,

        recentOrders,

        bestSellingProducts

    };

};

export default {

    getDashboard

};