/**
 * src/app/api/youtube-transcript/route.js
 *
 * YouTube動画の字幕を取得するAPIエンドポイント
 */

import { YoutubeTranscript } from 'youtube-transcript';

export async function GET(req) {
  console.log("start route route.js");
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get('videoId');

  

  if (!videoId) {
    console.log("no videoId route.js");
    return new Response(JSON.stringify({ error: 'videoIdが指定されていません．' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log("start try route.js");
    console.log("videoId in route.js", videoId);

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    console.log("transscript in route.js", transcript);
    const transcriptText = transcript.map(entry => entry.text).join(' ');

    console.log("transcriptText in route.js", transcriptText);

    return new Response(JSON.stringify({ transcript: transcriptText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log("error route.js");
    console.error('字幕取得エラー:', error.message);
    return new Response(JSON.stringify({ error: '字幕の取得に失敗しました．' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
