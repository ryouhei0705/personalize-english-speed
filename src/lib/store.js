// src/lib/store.js

let transcriptStore = ''; // 文字起こしの保存
let videoLength = 0;      // 動画の長さの保存

export function setStoredTranscript(text) {
  transcriptStore = text;
}

export function getStoredTranscript() {
  return transcriptStore;
}

export function setStoredVideoLength(length) {
  videoLength = length;
}

export function getStoredVideoLength() {
  return videoLength;
}
