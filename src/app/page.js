'use client';

import { useState } from 'react';

export default function Home() {
  const [videoId, setVideoId] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTranscript = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/transcript?videoId=${videoId}`);
      const data = await response.json();

      if (response.ok) {
        setTranscript(data.transcript);
      } else {
        alert(data.error || '字幕の取得に失敗しました。');
      }
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました。');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>YouTube文字起こしテスト</h1>
      <input
        type="text"
        placeholder="YouTube動画IDを入力"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        style={{ width: '300px', marginRight: '10px', color: '#000000', width: '90%'}}
      />
      <button onClick={fetchTranscript} disabled={loading}
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
