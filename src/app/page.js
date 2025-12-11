'use client';

import React, {useState} from "react";

import { fetchVideoLength } from './youtube-iframe/duration';

export default function Home() {
  // 計算中を判定する
  const [isCalculateRate, setIsCalculateRate] = useState(false);

  // エラーメッセージ
  const [errorMessage, setErrorMessage] = useState("");
  // TOEICスコア
  const [toeic, setToeic] = useState(1);
  // 動画のURL
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=00NgUctWoLQ');
  // 再生倍率,0.25~2.00の0.05刻み
  const [rate, setRate] = useState(1.0);

  const [loading, setLoading] = useState(false);
  const [transcriptLength, setTranscriptLength] = useState(0); // 動画の文字数
  const [videoLength, setVideoLength] = useState(0); // 動画の長さ(秒)

  // apiのurl
  const API_URL = '/api/WPMcalculate'

  // 入力に合わせて，TOEICスコアを更新する
  const onChangeToeic = (event) => {
    setToeic(event.target.value)
  }

  // 入力に合わせて動画のURLを更新する
  const onChangeUrl = (event) => {
    setUrl(event.target.value)
  }

  // ボタンを押すと適正発話速度と動画のURLを渡して，計算された倍率を受け取る
  const calculateRate = async () => {
    // 計算を開始したことを記録
    setIsCalculateRate(true);

    // エラーメッセージをリセット
    setErrorMessage(""); 

    // URLから動画IDを抽出する関数
    const extractVideoId = (url) => {
      const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    try {
      // urlから動画IDを抽出
      const videoId = extractVideoId(url);

      // 動画IDが取得できなかった場合
      if (!videoId) {
        alert('有効なYouTube URLを入力してください。');
        return;
      }
      
      // 動画IDが取得できた場合、動画の長さ(秒)を取得
      const newVideoLength = await fetchVideoLength(videoId)
      setVideoLength(newVideoLength)//, setVideoLength);

      console.log("videoLength in page", newVideoLength)

      if(newVideoLength > 600)
      {
        // 動画時間が10分(600秒)超えていた時，表示して終わらせる
        setErrorMessage("動画時間は10分以内にしてください");
        return;
      }

      // 動画IDが取得できた場合、動画の文字起こしの文字数を取得，約10分以内である必要がある
      const transcriptResponse = await fetch(`/api/youtube-transcript/?videoId=${videoId}`,{
        method: 'GET',
      })
      // ステータスコードで分岐する
      if (transcriptResponse.status === 429) {
        // apiの無料枠が終了した時
        setErrorMessage("本日のAI利用枠を超えました。明日また来てください");
        return; // ここで終了
      }

      if (!transcriptResponse.ok) {
        // 429以外のエラー（500など）
        setErrorMessage("エラーが発生しました。時間を置いて試してください。");
        return;
      }

      const transcriptData = await transcriptResponse.json();
      const newTranscriptLength = transcriptData.length;
      console.log("transcriptData in page", transcriptData)
      setTranscriptLength(newTranscriptLength);
      
      console.log("transcriptData in page", transcriptData)
      console.log("transcriptLength in page", newTranscriptLength)

      // クエリパラメータを作成
      const params = new URLSearchParams({
        transcriptLength: newTranscriptLength, 
        videoLength: newVideoLength, 
        toeic: toeic
      }).toString();
      const res = await fetch(`${API_URL}?${params}`,{method: 'GET'})
 
      // レスポンスをJSONとして取得
      const data = await res.json()
      setRate(data.rate)

      // 計算を終了したことを記録
      setIsCalculateRate(false);
    } catch (err) {
      alert(err)

      // 計算を終了したことを記録
      setIsCalculateRate(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>あなたのTOEICスコアと10分以内の動画の動画URLを入力してください</h1>
      <label>TOEICスコア：<input type="text" onChange={onChangeToeic}/></label>
      <label>動画URL：<input type="text" onChange={onChangeUrl}/></label>
      <button type="submit" onClick={calculateRate}>再生倍率を計算</button>

      <p>再生倍率：{rate}</p>

      {/* 倍率を計算中であることを提示 */}
      {isCalculateRate && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          再生倍率を計算中です...(最大1分ほどかかります)
        </p>
      )}

      {/* エラーがあれば赤文字で表示 */}
      {errorMessage && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          {errorMessage}
        </p>
      )}
    </main>
  )
}
