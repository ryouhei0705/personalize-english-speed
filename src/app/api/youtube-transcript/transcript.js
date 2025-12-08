/**
 * src/app/api/youtube-transcript/transcript.js
 *
 * YouTube動画の文字起こしに関する関数
 */

import { setStoredTranscript, setStoredTranscriptLength } from '../../../lib/store';

//  文字起こしを取得
const fetchTranscript = async (videoId) => {//, setTranscriptLength, setLoading) => {//, setTranscript, setLoading) => {
  // setLoading(true);
  try {
    const response = await fetch(`/api/youtube-transcript/?videoId=${videoId}`);
    const data = await response.json();

    if (response.ok) {
      //  文字起こしを取得，整形し，共有変数に保存
      //  文字数も保存
      console.log("transcriptText in transcript", data.transcript);
      
      const transcriptText = editTranscript(data.transcript);
      
      console.log("transcriptText in transcript", data.transcript);

      setStoredTranscript(transcriptText);
      // setTranscriptLength(getTranscriptLength(transcriptText));
      setStoredTranscriptLength(getTranscriptLength(transcriptText));

      console.log("transcriptLength in transcript", getTranscriptLength(transcriptText))
      return getTranscriptLength(transcriptText)
    } else {
      console.log(data.error || '文字起こしの取得に失敗しました．');
      // alert(data.error || '文字起こしの取得に失敗しました．');
    }
  } catch (error) {
    console.error(error);
    console.log('エラーが発生しました．');
    // alert('エラーが発生しました．');
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
  return transcript.length;
};

export { editTranscript };
export { fetchTranscript };