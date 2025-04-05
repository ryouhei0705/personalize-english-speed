'use client';

import { useState } from 'react';
import { fetchTranscript } from './api/youtube-transcript/transcript';

export default function Home() {
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState(''); //  取得した字幕を格納する状態

  //  字幕取得ボタンがクリックされたときの処理
  const handleFetchTranscript = () => {
    fetchTranscript(videoId, setTranscript, setLoading);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>YouTube文字起こしテスト</h1>
      <input
        type="text"
        placeholder="YouTube動画URLを入力"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        style={{ width: '90%', marginRight: '10px', color: '#000000' }}
      />
      <button
        onClick={handleFetchTranscript} //  ボタンがクリックされたときにhandleFetchTranscriptを呼び出す
        disabled={loading}
        style={{
          backgroundColor: '#0070f3',
          color: '#ffffff',
          border: 'none',
          borderRadius: '5px',
          marginTop: '20px',
          padding: '10px 20px',
          cursor: loading ? 'not-allowed' : 'pointer',
      }}>
        {loading ? '取得中...' : '字幕を取得'}
      </button>
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        <h2>字幕:</h2>
        <p>{transcript || 'ここに字幕が表示されます。'}</p>
      </div>
    </div>
  );
}