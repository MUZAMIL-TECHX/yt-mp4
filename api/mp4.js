const axios = require('axios');

module.exports = async (req, res) => {
    // CORS Enable
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const videoUrl = req.query.url;

    // Agar URL missing hai
    if (!videoUrl) {
        return res.status(400).json({
            creator: 'c9muzamil',
            contect: '923130122643',
            team: 'TeamRedXhackers',
            channel: 'https://whatsapp.com/channel/0029VbCkm3rAe5VzCYLtNb2u',
            error: 'Bhai URL toh do! Example: /mp4?url=https://youtu.be/xyz'
        });
    }

    try {
        // Cobalt API (v10) ko call kar rahe hain direct MP4 link ke liye
        const response = await axios.post('https://api.cobalt.tools/', {
            url: videoUrl,
            vQuality: '720', // 720p quality (aap 1080 bhi kar sakte hain)
            filenamePattern: 'basic'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 15000 // 15 seconds timeout
        });

        const data = response.data;

        // Cobalt API ka naya response structure check kar rahe hain
        if (data && data.status === 'redirect' && data.url) {
            // Direct MP4 Link mil gaya!
            // Vercel ko bolein ke user ko us link par redirect kar de (Download shuru)
            return res.redirect(data.url); 
        } 
        else if (data && data.status === 'tunnel' && data.url) {
            // Kabhi kabhi Cobalt tunnel URL deta hai (streaming ke liye)
            return res.redirect(data.url);
        } 
        else if (data && data.status === 'error') {
            throw new Error(data.error && data.error.code ? data.error.code : 'Cobalt API Error');
        } 
        else {
            throw new Error('Invalid response from Cobalt API');
        }

    } catch (error) {
        console.error('MP4 API Error:', error.message);
        res.status(500).json({
            creator: 'c9muzamil',
            contect: '923130122643',
            team: 'TeamRedXhackers',
            error: 'Download fail ho gaya. Link sahi hai?',
            details: error.message
        });
    }
};
