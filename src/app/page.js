'use client';

import { useState } from 'react';
import { fetchTranscript } from './api/youtube-transcript/transcript';
import { fetchVideoLength } from './api/youtube-iframe/duration';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState(''); // 取得した字幕を格納する状態
  const [videoLength, setVideoLength] = useState(0); // 動画の長さを格納する状態

  // URLから動画IDを抽出する関数
  const extractVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // URL入力時の処理
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setVideoUrl(url);
    const id = extractVideoId(url);
    setVideoId(id);
  };

  // 字幕取得ボタンがクリックされたときの処理
  const handleFetchVideoInfo = async () => {
    if (!videoId) {
      alert('有効なYouTube URLを入力してください。');
      return;
    }
    // 動画IDが取得できた場合、字幕を取得
    await fetchTranscript(videoId, setTranscript, setLoading);
    // 動画の長さを取得
    await fetchVideoLength(videoId, setVideoLength, setLoading);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', margin: '0 auto' }}>

      <h1>YouTube文字起こし＆時間取得テスト</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="YouTube動画URLを入力"
          value={videoUrl}
          onChange={handleUrlChange}
          style={{
            color: 'black',
            width: '100%',
          }}
        />

        <button onClick={handleFetchVideoInfo} disabled={loading || !videoId}
          style={{
            marginLeft: '10px',
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}>
          {loading ? '取得中...' : '動画情報を取得'}
        </button>
      </div>

      <div>
        <h3>動画の長さ:</h3>
        <p>
          {videoLength ? `${videoLength}秒` : '読み込み中...'}
        </p>

        <h3>字幕:</h3>
        <p>{transcript || '字幕データが利用できません。'}</p>
      </div>
    </div>
  );
}