const paginate = ({
    page = 1,
    limit = 10,
    totalItems
}) => {

    page = Number(page);
    limit = Number(limit);

    return {

        page,

        limit,

        totalItems,

        totalPages: Math.ceil(totalItems / limit),

        hasNextPage: page * limit < totalItems,

        hasPrevPage: page > 1

    };

};

export default paginate;