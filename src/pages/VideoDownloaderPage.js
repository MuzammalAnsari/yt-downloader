'use client'

import React, { useState } from 'react';
import axios from 'axios'; // For making HTTP requests

const VideoDownloaderPage = () => {
  const [videoLink, setVideoLink] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [format, setFormat] = useState('');
  const [loading, setLoading] = useState(false); // State for managing loading state

  const handleDownload = async () => {
    // Set loading to true when starting the download
    setLoading(true);

    // Send a request to your backend API to initiate the download
    try {
      await axios.post('/api/download', {
        videoLink,
        resolution: selectedOption === 'audio' ? undefined : selectedOption,
      });
      // Handle success
      console.log('Download initiated');
    } catch (error) {
      // Handle error
      console.error('Error initiating download:', error);
    } finally {
      // Set loading to false after receiving the response (whether success or error)
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
        {/* Add other resolutions or audio formats if needed */}
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
          {/* Add other audio formats if needed */}
        </select>
      )}
      {/* Display loader when loading state is true */}
      {loading ? (
        <div className="mt-4 text-center">Loading...</div>
      ) : (
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white p-4 md:p-2 mt-4 rounded-lg"
        >
          Download
        </button>
      )}
    </div>
  );
};

export default VideoDownloaderPage;
