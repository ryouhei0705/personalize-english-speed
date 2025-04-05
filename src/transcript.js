import { YoutubeTranscript } from 'youtube-transcript';

/**
 * YouTube動画の文字起こしを取得する関数
 * @param {string} videoId - YouTube動画のID
 * @returns {Promise<string>} - 文字起こしされたテキスト
 */
export const getTranscript = async (videoId) => {
  try {
    // YouTubeの字幕データ取得
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    // 字幕データからテキスト部分を結合して返す
    return transcript.map(entry => entry.text).join(' ');
  } catch (error) {
    console.error('字幕取得エラー:', error.message);
    throw new Error('字幕の取得に失敗しました。');
  }
};
