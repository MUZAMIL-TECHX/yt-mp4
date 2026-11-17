const axios = require('axios');

// Ye Invidious ke public instances hain. Agar ek fail ho, toh doosra try karega.
const INVIDIOUS_INSTANCES = [
    'https://inv.nadeko.net',
    'https://yewtu.be',
    'https://invidious.nerdvpn.de',
    'https://vid.puffyan.us'
];

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

    // YouTube ID nikalein
    let videoId = '';
    if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
    } else if (videoUrl.includes('v=')) {
        videoId = videoUrl.split('v=')[1].split('&')[0];
    } else {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    let lastError = 'All instances failed';

    // Har instance ko try karein
    for (const instance of INVIDIOUS_INSTANCES) {
        try {
            const apiUrl = `${instance}/api/v1/videos/${videoId}`;
            const response = await axios.get(apiUrl, { timeout: 10000 });
            const data = response.data;

            if (data && data.formatStreams) {
                // MP4 (Video+Audio) format dhoondein
                const mp4Format = data.formatStreams.find(f => f.container === 'mp4' && f.resolution !== 'audio');
                
                if (mp4Format && mp4Format.url) {
                    // Direct MP4 link mil gaya! Redirect kar dein
                    return res.redirect(mp4Format.url);
                }
            }
        } catch (err) {
            console.log(`Instance ${instance} failed:`, err.message);
            lastError = err.message;
        }
    }

    // Agar sab fail ho jayein
    res.status(500).json({
        creator: 'c9muzamil',
        contect: '923130122643',
        team: 'TeamRedXhackers',
        error: 'Download fail ho gaya.',
        details: 'Invidious instances failed. Try again later.'
    });
};
