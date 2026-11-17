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
        // Naya live instance (Cobalt v10 official API)
        const response = await axios.post('https://api.cobalt.tools/', {
            url: videoUrl,
            videoQuality: '720', // Naye API mein vQuality ki jagah videoQuality aata hai
            downloadMode: 'auto'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 20000 
        });

        const data = response.data;

        // Status check
        if (data && (data.status === 'redirect' || data.status === 'tunnel') && data.url) {
            return res.redirect(data.url); 
        } 
        else if (data && data.status === 'picker' && data.picker) {
            // Agar multiple formats aayein toh video (mp4) wala pick karein
            const videoOption = data.picker.find(opt => opt.type === 'video');
            if (videoOption && videoOption.url) {
                return res.redirect(videoOption.url);
            }
            throw new Error('Video format nahi mila');
        } 
        else if (data && (data.text || data.error)) {
            throw new Error(data.text || data.error.code); 
        } 
        else {
            throw new Error('Koi direct link nahi mila. Cobalt ne reject kar diya.');
        }

    } catch (error) {
        console.error('MP4 API Error:', error.message);
        
        // Agar API fail ho jaye toh proper error bhejein
        res.status(500).json({
            creator: 'c9muzamil',
            contect: '923130122643',
            team: 'TeamRedXhackers',
            error: 'Download fail ho gaya.',
            details: error.message
        });
    }
};
