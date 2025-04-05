import { NextResponse } from 'next/server';

export const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000', // 許可するオリジン
  'Access-Control-Allow-Methods': 'GET', // 許可するメソッド
  'Access-Control-Allow-Headers': 'Content-Type', // 許可するリクエストヘッダー
}

export async function GET(req) {
    // クエリパラメータを取得
    const url: string = req.nextUrl.searchParams.get('url');
    const toeicScore: number = req.nextUrl.searchParams.get('toeic');
    

    // // データをクライアントに返す
    return NextResponse.json({ rate: playBackRate });
  }
