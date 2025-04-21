export const sanitizeRequest = (req, res, next) => {
    // Sanitize body
    if (req.body) {
        const sanitizedBody = {};
        for (const key in req.body) {
            if (typeof req.body[key] === "string") {
                sanitizedBody[key] = req.body[key].replace(/[^\w\s]/gi, "_");
            } else {
                sanitizedBody[key] = req.body[key];
            }
        }
        req.body = sanitizedBody;
    }
  
    // Add sanitized query as a new property
    if (req.query) {
        const sanitizedQuery = {};
        for (const key in req.query) {
            if (typeof req.query[key] === "string") {
                sanitizedQuery[key] = req.query[key].replace(/[^\w\s]/gi, "_");
            } else {
                sanitizedQuery[key] = req.query[key];
            }
        }
        req.sanitizedQuery = sanitizedQuery;
    }
  
    next();
};
