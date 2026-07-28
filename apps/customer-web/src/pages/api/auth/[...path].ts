import type { NextApiRequest, NextApiResponse } from 'next';

const AUTH_SERVICE_URL = 'http://localhost:3001';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { path } = req.query;
    const pathStr = Array.isArray(path) ? path.join('/') : path || '';

    try {
        const options: RequestInit = {
            method: req.method,
            headers: { 'Content-Type': 'application/json' },
        };

        if (req.method !== 'GET' && req.method !== 'HEAD') {
            options.body = JSON.stringify(req.body || {});
        }

        const response = await fetch(`${AUTH_SERVICE_URL}/${pathStr}`, options);
        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error: any) {
        console.error('Auth API Proxy Error:', error);
        res.status(500).json({ success: false, message: 'Service unavailable. Please try again later.' });
    }
}