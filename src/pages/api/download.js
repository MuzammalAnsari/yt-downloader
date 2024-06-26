// pages/api/download.js
import ytdl from 'ytdl-core'; // For downloading YouTube videos

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { videoLink, resolution, format } = req.body;
    try {
      const info = await ytdl.getInfo(videoLink);

      let selectedFormat;
      let fileExtension = 'mp4';

      if (resolution === undefined && format) {
        // Handle audio-only request
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        selectedFormat = audioFormats.find(f => f.container === format);
        fileExtension = format;
        if (!selectedFormat) {
          throw new Error('Audio format not available');
        }
      } else {
        // Handle video request
        const videoFormats = ytdl.filterFormats(info.formats, 'videoonly');
        selectedFormat = videoFormats.find(f => f.height <= resolution);
        if (!selectedFormat) {
          throw new Error('Resolution not available');
        }
      }

      // Set response headers to indicate a file download
      res.setHeader('Content-Type', selectedFormat.mimeType || 'video/mp4');
      res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}"`);

      // Stream video/audio data directly to the client
      ytdl(videoLink, { format: selectedFormat }).pipe(res);
    } catch (error) {
      console.error('Error downloading video:', error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
