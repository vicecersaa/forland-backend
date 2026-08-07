const parseFormData = (req, res, next) => {

    try {

        const parseValue = (value) => {

            if (typeof value !== "string") {

                return value;3

            }

            const trimmed = value.trim();

            // JSON Object / Array
            if (

                (trimmed.startsWith("{") && trimmed.endsWith("}")) ||

                (trimmed.startsWith("[") && trimmed.endsWith("]"))

            ) {

                try {

                    return JSON.parse(trimmed);

                } catch {

                    return value;

                }

            }

            // Boolean
            if (trimmed === "true") {

                return true;

            }

            if (trimmed === "false") {

                return false;

            }

            // Number
            if (

                trimmed !== "" &&

                !Number.isNaN(Number(trimmed))

            ) {

                return Number(trimmed);

            }

            return value;

        };

        Object.keys(req.body).forEach((key) => {

    req.body[key] = parseValue(req.body[key]);

    if (key === 'category') {
        console.log('CATEGORY AFTER PARSE:', req.body[key], typeof req.body[key]);
    }

});

        next();

    } catch (error) {

        next(error);

    }

};

export default parseFormData;