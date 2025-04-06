/**
 * src/app/api/youtube-transcript/route.js
 *
 * YouTube動画の字幕を取得するAPIエンドポイント
 */

import { YoutubeTranscript } from 'youtube-transcript';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return new Response(JSON.stringify({ error: 'videoIdが指定されていません．' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(entry => entry.text).join(' ');

    return new Response(JSON.stringify({ transcript: transcriptText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('字幕取得エラー:', error.message);
    return new Response(JSON.stringify({ error: '字幕の取得に失敗しました．' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
