import { NextResponse } from 'next/server';


import {getStoredTranscriptLength, getStoredVideoLength} from '../../../lib/store';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://personalize-english-speed.vercel.app', // 許可するオリジン，本番
  // 'Access-Control-Allow-Origin': 'localhost:3000', // 許可するオリジン，開発時
  'Access-Control-Allow-Methods': 'GET', // 許可するメソッド
}

export async function GET(req) {
    // クエリパラメータを取得
    // const url: string = req.nextUrl.searchParams.get('url'); // 動画のURL
    const transcriptLength: number = Number(req.nextUrl.searchParams.get('transcriptLength')) || 0; // 動画の文字数
    const videoLength: number = Number(req.nextUrl.searchParams.get('videoLength')) || 0; // 動画の長さ(秒)
    const toeicScore: number = Number(req.nextUrl.searchParams.get('toeic')) || 0; // TOEICスコア
    
    // TOEICスコアから推奨WPM（Words Per Minute：1分あたりの単語数）を算出
    // 計算式：推奨WPM = TOEICスコア / 10 + 60
    const appropriateWPM: number = toeicScore / 10 + 60 

    console.log("appropriateWPM in WPMcalculate", appropriateWPM);

    // 動画の文字数と長さが0の場合は再生速度の倍率を0とする
    if (transcriptLength === 0 || videoLength === 0) {
      return NextResponse.json({ rate: 0 });
    }

    const videoWPM: number = (60 * transcriptLength)/videoLength //動画のWPM

    console.log("videoWPM in WPMcalculate", videoWPM);

    let playBackRate: number = appropriateWPM/videoWPM  // 再生速度の倍率を算出
    
    console.log("playBackRate in WPMcalculate", playBackRate);

    // 再生速度の倍率を0.05刻みに調整
    const remainder: number = playBackRate % 0.05 // 0.05で割った余りを計算
    console.log("remainder in WPMcalculate", remainder);
    // 余りが0.025以上の場合は切り上げ、それ以外は切り捨て
    if (remainder >= 0.025) {
      playBackRate += 0.05 - remainder;// 切り上げ
      } else {
        playBackRate -= remainder;// 切り捨て
      }

    // 小数点2桁以下の数が余ることがあるので、小数点2桁以下を切り捨て ※文字列型になる
    const playBackRate_String: string = playBackRate.toFixed(2)
    playBackRate = parseFloat(playBackRate_String)// 文字列を数値に変換
    
    // // データをクライアントに返す
    return NextResponse.json({ rate: playBackRate });
  }
