import { NextResponse } from 'next/server';

export const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000', // 許可するオリジン
  'Access-Control-Allow-Methods': 'GET', // 許可するメソッド
  'Access-Control-Allow-Headers': 'Content-Type', // 許可するリクエストヘッダー
}

export async function GET(req) {
    // クエリパラメータを取得
    const url: string = req.nextUrl.searchParams.get('url'); // 動画のURL
    const toeicScore: number = req.nextUrl.searchParams.get('toeic'); // TOEICスコア
    
    // TOEICスコアから推奨WPM（Words Per Minute：1分あたりの単語数）を算出
    // 計算式：推奨WPM = TOEICスコア / 10 + 70
    const appropriateWPM = toeicScore / 10 + 70 
    // 動画の文字数と長さを取得（一旦は固定値を使用、実際のデータは宮坂さんのデータから取得）
    const transcriptStore = 600 // 動画の総文字数
    const videoLength = 120 // 動画の長さ（秒）

    const videoWPM = transcriptStore/videoLength * 60 //動画のWPM
    let playBackRate = appropriateWPM/videoWPM  // 再生速度の倍率を算出
    // 再生速度の倍率を0.05刻みに調整
    const remainder = playBackRate % 0.05 // 0.05で割った余りを計算
    // 余りが0.025以上の場合は切り上げ、それ以外は切り捨て
    if (remainder >= 0.025) {
        playBackRate += 0.05 - remainder;// 切り上げ
        } else {
          playBackRate -= remainder;// 切り捨て
        }
    // 小数点2桁以下の数が余ることがあるので、小数点2桁以下を切り捨て ※文字列型になる
    const playBackRate_String = playBackRate.toFixed(2)
    playBackRate = parseFloat(playBackRate_String)// 文字列を数値に変換

    // // データをクライアントに返す
    return NextResponse.json({ rate: playBackRate });
  }
