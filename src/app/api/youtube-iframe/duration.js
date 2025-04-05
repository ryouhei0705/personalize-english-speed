/**
 * api/youtube-iframe/duration.js
 *
 * YouTube動画の長さを取得するAPIエンドポイント
 */

// YouTube IFrame Player APIを読み込む
const loadYouTubeIframeAPI = () => {
  return new Promise((resolve) => {
    // すでにAPIが読み込まれている場合はすぐに解決
    if (window.YT) {
      resolve();
      return;
    }

    // APIの読み込みが完了したときのコールバックを設定
    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };

    // scriptタグを作成してAPIを読み込む
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(scriptTag);
  });
};

// 動画の長さを取得する関数
const getVideoDuration = (videoId) => {
  return new Promise((resolve, reject) => {
    // 非表示のコンテナを作成
    const container = document.createElement('div');
    container.style.display = 'none';
    document.body.appendChild(container);

    const player = new window.YT.Player(container, {
      videoId: videoId,
      events: {
        onReady: (event) => {
          // 動画の長さを秒単位で取得
          const duration = event.target.getDuration();
          // プレーヤーを破棄
          event.target.destroy();
          // コンテナを削除
          document.body.removeChild(container);
          // 結果を返す
          resolve(duration);
        },
        onError: (event) => {
          // エラーが発生した場合は拒否
          document.body.removeChild(container);
          reject(`エラー: ${event.data}`);
        }
      }
    });
  });
};

// 動画の長さを取得する関数
const fetchVideoLength = async (videoId, setVideoLength, setLoading) => {
  if (!videoId) {
    alert('動画IDが指定されていません。');
    return;
  }

  setLoading(true);

  try {
    // YouTube IFrame APIを読み込む
    await loadYouTubeIframeAPI();

    // 動画の長さを取得
    const duration = await getVideoDuration(videoId);

    // 状態を更新
    setVideoLength(duration);

    // オプション: ローカルストレージに保存
    localStorage.setItem(`videoLength_${videoId}`, duration.toString());
  } catch (error) {
    console.error('動画の長さの取得に失敗しました:', error);
    alert('動画の長さの取得に失敗しました。');
  } finally {
    setLoading(false);
  }
};

export { fetchVideoLength };