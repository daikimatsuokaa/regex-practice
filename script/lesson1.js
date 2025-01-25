// lesson1.js

window.lesson1 = {
    id: 1,
    title: "Lesson 1: Name と Age をキャプチャ",
    description:
      "『Name: XXX, Age: YYY』形式から名前と年齢をキャプチャする問題を複数用意しています。<br>" +
      "例: <code>Name: John, Age: 30</code> → 第1キャプチャ: John / 第2キャプチャ: 30",
    problems: [
      {
        title: "Problem 1: 基本パターン",
        lines: [
          {
            text: "Name: John, Age: 30",
            expectedCaptures: ["John", "30"],
          },
          {
            text: "Name: Lucy, Age: 25",
            expectedCaptures: ["Lucy", "25"],
          },
        ],
      },
      {
        title: "Problem 2: 名前にスペースが含まれるケース",
        lines: [
          {
            text: "Name: Mary Ann, Age: 40",
            expectedCaptures: ["Mary Ann", "40"],
          },
          {
            text: "Name: John Smith, Age: 59",
            expectedCaptures: ["John Smith", "59"],
          },
        ],
      },
    ],
  };
  