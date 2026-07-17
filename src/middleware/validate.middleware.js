const validate = (schema) => {
    return async (req, res, next) => {
        try {

            req.body = await schema.parseAsync(req.body);

            next();

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.errors?.[0]?.message || "Validation Error"
            });

        }
    };
};

export default validate;