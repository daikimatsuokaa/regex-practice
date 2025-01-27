// lesson2.js
// こちらも id を数値に
window.lesson2 = {
    id: 2,
    title: "Lesson 2: メールアドレスのキャプチャ",
    description:
      "例: <code>hello@example.com</code> → 第1キャプチャ: hello / 第2キャプチャ: example.com",
    problems: [
      {
        title: "Problem 1",
        lines: [
          {
            text: "someone@example.com",
            expectedCaptures: ["someone", "example.com"],
          },
          {
            text: "user123@test.co.jp",
            expectedCaptures: ["user123", "test.co.jp"],
          },
        ],
      },
    ],
  };
  