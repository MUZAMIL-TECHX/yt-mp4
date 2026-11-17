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
        // Naya Reliable Cobalt Instance
        const response = await axios.post('https://co.wuk.sh/api/json', {
            url: videoUrl,
            vQuality: '720',
            filenamePattern: 'basic'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 20000 
        });

        const data = response.data;

        if (data && data.status === 'redirect' && data.url) {
            // Download Link mil gaya, user ko redirect kar do
            return res.redirect(data.url); 
        } 
        else if (data && data.status === 'stream' && data.url) {
            return res.redirect(data.url);
        } 
        else if (data && data.status === 'picker' && data.picker) {
            // Agar YouTube multiple formats de raha hai (video/audio)
            // Toh hum video (mp4) wala link utha lenge
            const videoOption = data.picker.find(opt => opt.type === 'video');
            if (videoOption && videoOption.url) {
                return res.redirect(videoOption.url);
            }
            throw new Error('Video format nahi mila');
        } 
        else if (data && data.text) {
            throw new Error(data.text); // Error message Cobalt se
        } 
        else {
            throw new Error('Koi direct link nahi mila');
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
