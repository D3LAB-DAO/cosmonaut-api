import rateLimit from "express-rate-limit"

const apiLimiter = rateLimit(
    {
        windowMs: 60 * 1000,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false
    }
)

export {
    apiLimiter
}