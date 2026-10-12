import rateLimit from 'express-rate-limit';

const base = { standardHeaders: true, legacyHeaders: false };
export const loginLimiter = rateLimit({ ...base, windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many login attempts. Try again in 15 minutes.' } });
export const enquiryLimiter = rateLimit({ ...base, windowMs: 60 * 60 * 1000, max: 8, message: { error: 'Too many submissions from this connection. Please try again later.' } });
export const apiLimiter = rateLimit({ ...base, windowMs: 60 * 1000, max: 240, message: { error: 'Too many requests.' } });
export const adminLimiter = rateLimit({ ...base, windowMs: 60 * 1000, max: 300, message: { error: 'Too many requests.' } });
