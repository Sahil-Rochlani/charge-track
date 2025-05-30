function formatZodError(error) {
    let formatted = {};

    const flattenErrors = (errObj, path = '') => {
        for (const [key, value] of Object.entries(errObj)) {
            const newPath = path ? `${path}.${key}` : key;

            if (value?._errors?.length) {
                formatted[newPath] = value._errors[0];
            }

            if (typeof value === 'object' && !Array.isArray(value)) {
                flattenErrors(value, newPath);
            }
        }
    };

    flattenErrors(error.format());
    return formatted;
}

module.exports = formatZodError