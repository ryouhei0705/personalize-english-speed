/**
 * src/app/api/youtube-transcript/transcript.js
 *
 * YouTube動画の文字起こしに関する関数
 */

import { setStoredTranscript } from '@/lib/store';

//  文字起こしを取得
const fetchTranscript = async (videoId, setTranscript, setLoading) => {
  setLoading(true);
  try {
    const response = await fetch(`/api/youtube-transcript/?videoId=${videoId}`);
    const data = await response.json();

    if (response.ok) {
      const transcriptText = editTranscript(data.transcript);
      setTranscript(transcriptText);
      setStoredTranscript(transcriptText);
    } else {
      alert(data.error || '文字起こしの取得に失敗しました．');
    }
  } catch (error) {
    console.error(error);
    alert('エラーが発生しました．');
  }
  setLoading(false);
};

// 文章を編集
const editTranscript = (transcript) => {
  return transcript
    .replaceAll('&amp;#39;', '\'')
    .replaceAll(/\[[^\]]*\]/g, '');
}

export { editTranscript };
export { fetchTranscript };