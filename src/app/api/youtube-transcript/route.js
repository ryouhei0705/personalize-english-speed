/**
 * src/app/api/youtube-transcript/transcript.js
 *
 * YouTube動画の文字起こしに関する関数
 */

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// vercelのタイムアウト時間を延長，無料枠の上限は60s
export const maxDuration = 60;

//  文字起こしを取得
export async function GET(request){
  // apiのurlからvideoIdを取得
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite-preview-09-2025",
    });

    const result = await model.generateContent([
      "Please output only the automatically generated English subtitle information as text, without referencing the audio or visual content of the video.",
      {
        fileData: {
        fileUri: `https://www.youtube.com/watch?v=${videoId}`,
        },
      },
      ]);
    // console.log(result.response.text());

    const response = result.response;

    if (response.candidates[0].finishReason == "STOP") {
      //  文字起こしを取得，整形し，共有変数に保存
      //  文字数も保存
      
      const transcriptText = editTranscript(response.text());

      return NextResponse.json({
        length: getTranscriptLength(transcriptText)
      });
    } else {
      console.error('Gemini API finished with reason:', response.candidates[0].finishReason);
  
      return NextResponse.json(
        { error: 'GenerationFailed', message: '文字起こしの生成に失敗しました。' },
        { status: 500 }
  );
    }
  } catch (error) {
    console.error(error);
    console.log(error);

    const isQuotaExceeded = error.status === 429; 
    // || 
    //                         error.message?.includes('429') || 
    //                         error.message?.includes('Quota');

    if (isQuotaExceeded) {
      // 429 (Too Many Requests) として返す
      return NextResponse.json(
        { error: 'LimitExceeded', message: '本日の利用上限に達しました。明日また試してください。' },
        { status: 429 }
      );
    }

    // その他のエラー（500 Internal Server Error）
    return NextResponse.json(
      { error: 'ServerError', message: '予期せぬエラーが発生しました。' },
      { status: 500 }
    );

  }
  // setLoading(false);
};

// 文章を編集
const editTranscript = (transcript) => {
  return transcript
    .replaceAll('&amp;#39;', '\'')
    .replaceAll(/\[[^\]]*\]/g, '');
}

//  文字起こしの文字数を取得
const getTranscriptLength = (transcript) => {
  // 前後の空白を除去
  const trimmed = transcript.trim();

  if (trimmed.length === 0) return 0;

  // 連続スペースを 1 個に正規化
  const normalized = trimmed.replace(/\s+/g, " ");

  // 空白で区切って配列の長さを返す
  return normalized.split(" ").length;
};