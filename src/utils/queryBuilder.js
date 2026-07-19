const queryBuilder = (
    query,
    {
        searchableFields = [],
        defaultSort = { createdAt: -1 }
    } = {}
) => {

    const page = Math.max(Number(query.page) || 1, 1);

    const limit = Math.max(Number(query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    const filter = {};

    // Search
    if (query.search && searchableFields.length > 0) {

        filter.$or = searchableFields.map(field => ({
            [field]: {
                $regex: query.search,
                $options: "i"
            }
        }));

    }

    // Active Filter
    if (query.isActive !== undefined) {

        filter.isActive = query.isActive === "true";

    }

    // Sorting
    let sort = defaultSort;

    if (query.sort) {

        sort = {};

        if (query.sort.startsWith("-")) {

            sort[query.sort.substring(1)] = -1;

        } else {

            sort[query.sort] = 1;

        }

    }

    return {

        page,

        limit,

        skip,

        filter,

        sort

    };

};

export default queryBuilder;