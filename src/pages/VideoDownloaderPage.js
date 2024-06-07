'use client'

import React, { useState } from 'react';
import axios from 'axios';

const VideoDownloaderPage = () => {
  const [videoLink, setVideoLink] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [format, setFormat] = useState('');
  const [loading, setLoading] = useState(false); // State for managing loading state
  const [message, setMessage] = useState(''); // State for user feedback

  const handleDownload = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/download', {
        videoLink,
        resolution: selectedOption === 'audio' ? undefined : selectedOption,
        format: selectedOption === 'audio' ? format : undefined,
      }, {
        responseType: 'blob', // Important for handling binary data
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'downloaded_video';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match.length > 1) {
          fileName = match[1];
        }
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage('Downloaded successfully!');
    } catch (error) {
      setMessage('Error initiating download. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Paste YouTube video link here"
        value={videoLink}
        onChange={(e) => setVideoLink(e.target.value)}
        className="w-full p-4 md:p-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
      />
      <select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        className="w-full p-4 md:p-2 mt-4 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
      >
        <option value="">Select video resolution or audio format</option>
        <option value="audio">Audio only</option>
        <option value="240">240p</option>
        <option value="360">360p</option>
        <option value="480">480p</option>
        <option value="720">720p</option>
        <option value="1080">1080p</option>
        <option value="2160">4K</option>
      </select>
      {selectedOption === 'audio' && (
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full p-4 md:p-2 mt-4 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
        >
          <option value="">Select audio format</option>
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
        </select>
      )}
      {loading ? (
        <div className="mt-4 text-center">Loading...</div>
      ) : (
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white p-4 md:p-2 mt-4 rounded-lg"
          disabled={!videoLink || !selectedOption || (selectedOption === 'audio' && !format)}
        >
          Download
        </button>
      )}
      {message && (
        <div className="mt-4 text-center">
          {message}
        </div>
      )}
    </div>
  );
};

export default VideoDownloaderPage;
