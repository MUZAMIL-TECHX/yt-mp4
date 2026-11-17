const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const videoUrl = req.query.url;

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
        // Aapke hi bot wali Vajira API (ytmp4 endpoint)
        const apiKey = 'VajiraOfc';
        const apiUrl = `https://vajiraofc-apis.vercel.app/api/ytmp4?apikey=${apiKey}&url=${encodeURIComponent(videoUrl)}`;

        const response = await axios.get(apiUrl, {
            timeout: 20000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const data = response.data;

        // Check karein ke link mila ya nahi
        if (data && data.success && data.data && data.data.download && data.data.download.url) {
            // Direct MP4 link mil gaya! User ko redirect kar dein
            return res.redirect(data.data.download.url);
        } 
        else {
            throw new Error('API ne direct link nahi diya');
        }

    } catch (error) {
        console.error('MP4 API Error:', error.message);
        
        res.status(500).json({
            creator: 'c9muzamil',
            contect: '923130122643',
            team: 'TeamRedXhackers',
            error: 'Download fail ho gaya.',
            details: error.message
        });
    }
};
