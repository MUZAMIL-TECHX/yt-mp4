const ytdl = require('@distube/ytdl-core');

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
        // Check karein ke link valid YouTube link hai ya nahi
        if (!ytdl.validateURL(videoUrl)) {
            throw new Error('Invalid YouTube URL');
        }

        // Video ki details nikalein
        const info = await ytdl.getInfo(videoUrl);

        // Sabse best MP4 (video + audio) format dhoondein
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highest', 
            filter: 'audioandvideo' 
        });

        if (!format || !format.url) {
            throw new Error('MP4 format nahi mila');
        }

        // Direct MP4 link mil gaya! User ko redirect kar dein
        return res.redirect(format.url);

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
