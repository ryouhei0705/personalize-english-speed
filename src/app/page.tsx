// src/app/page.tsx
// TypeScriptで書いてますが、javascritpにして頂いて大丈夫です。よかったら参考にしてください。
type GeminiApiResponse = {
    text: string;
  };
  
  async function getData(prompt: string) {
    try {
      const res = await fetch('http://localhost:3000/api/gemini-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt_post: prompt }),
      });
  
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
  
      const data: GeminiApiResponse = await res.json();
  
      if (!data.text) {
        throw new Error('API response missing text');
      }
  
      return data.text;
    } catch (error) {
      console.error(error);
      return 'エラーが発生しました'; // エラーメッセージを表示
    }
  }
  
  export default async function Home() {
    const transcriptStore = ""
    const prompt = '以下のかっこの中にある文字数をカウントして、教えてください「あああああ」'; // AI に送信するプロンプト
    const message = await getData(prompt); // プロンプトを引数として渡す
  
    return (
      <div>
        <h1>Gemini API Example</h1>
        <div>{message}</div>
      </div>
    );
  }