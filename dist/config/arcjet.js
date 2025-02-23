import dotenv from 'dotenv';
dotenv.config();
const ARCJET_KEY = process.env.ARCJET_KEY;
if (!ARCJET_KEY) {
    console.error('ARCJET_KEY is missing in environment variables');
    process.exit(1);
}
async function loadArcjet() {
    const { default: arcjet, shield, detectBot, tokenBucket, } = await import('@arcjet/node');
    return arcjet({
        key: ARCJET_KEY,
        characteristics: ['ip.src'], // Track requests by IP
        rules: [
            shield({ mode: 'LIVE' }),
            detectBot({ mode: 'LIVE', allow: ['CATEGORY:SEARCH_ENGINE'] }),
            tokenBucket({ mode: 'LIVE', refillRate: 5, interval: 10, capacity: 10 }),
        ],
    });
}
export default loadArcjet;
