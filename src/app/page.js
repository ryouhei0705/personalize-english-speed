'use client';

import React, {useState} from "react";

export default function Home() {
  // TOEICスコア
  const [toeic, setToeic] = useState(1);
  // 動画のURL
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=00NgUctWoLQ');
  // 再生倍率,0.25~2.00の0.05刻み
  const [rate, setRate] = useState(1.0);

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
    // setRate(speed + url)

    try {
      // クエリパラメータを作成
      const params = new URLSearchParams({url, toeic}).toString();
      const res = await fetch(`${API_URL}?${params}`,{method: 'GET'})

      // レスポンスをJSONとして取得
      const data = await res.json()
      setRate(data.rate)
    } catch (err) {
      alert(err)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>あなたのTOEICスコアと動画URLを入力してください</h1>
      <label>TOEICスコア：<input type="text" onChange={onChangeToeic}/></label>
      <label>動画URL：<input type="text" onChange={onChangeUrl}/></label>
      <button type="submit" onClick={calculateRate}>再生倍率を計算</button>

      <p>再生倍率：{rate}</p>
    </main>
  )
}
