// src/lib/store.js
// 簡易的なインメモリストア

let transcriptStore = '';

export function setStoredTranscript(text) {
  transcriptStore = text;
}

export function getStoredTranscript() {
  return transcriptStore;
}