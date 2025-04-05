// src/lib/store.js

let transcriptStore = '';

export function setStoredTranscript(text) {
  transcriptStore = text;
}

export function getStoredTranscript() {
  return transcriptStore;
}