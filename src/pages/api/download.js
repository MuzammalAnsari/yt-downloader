// pages/api/download.js
import ytdl from 'ytdl-core'; // For downloading YouTube videos
import zlib from 'zlib'; // For compression

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { videoLink, resolution } = req.body;
    try {
      const info = await ytdl.getInfo(videoLink);
      
      // Filter video formats based on resolution
      const videoFormats = ytdl.filterFormats(info.formats, 'videoonly');
      const selectedFormat = videoFormats.find(format => format.height <= resolution);

      if (!selectedFormat) {
        throw new Error('Resolution not available');
      }

      // Set response headers for chunked transfer encoding and video compression
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', `attachment; filename=${info.videoDetails.title}.${selectedFormat.container}`);
      res.setHeader('Transfer-Encoding', 'chunked');

      // Stream video data to client with compression
      ytdl(videoLink, { format: selectedFormat }).pipe(zlib.createGzip()).pipe(res);
    } catch (error) {
      console.error('Error downloading video:', error);
      res.status(500).json({ error: 'Failed to download video' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
