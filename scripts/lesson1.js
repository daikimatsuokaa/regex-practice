// lesson1.js
// レッスン1 - 例として15問（レベル1～10 + レベル11～15）を定義

window.lesson1 = {
  id: 1,
  title: "Lesson 1: レベル1～15",
  description: `
    正規表現の基本〜上級の練習問題を用意しました。<br>
    各問題の下部にある入力欄に正規表現パターンを入力し、<br>
    期待通りのキャプチャが得られるかをチェックしてみましょう。
  `,
  problems: [
    // ここまでが既存の10問
    {
      title: "問題1（レベル1）：4桁の数字をキャプチャしよう",
      lines: [
        {
          text: "郵便番号1234です",
          expectedCaptures: ["1234"],
        },
        {
          text: "abcd9999efgh",
          expectedCaptures: ["9999"],
        },
      ],
    },
    {
      title: "問題2（レベル2）：大文字のみ4文字をキャプチャしよう",
      lines: [
        {
          text: "TEST OK!",
          expectedCaptures: ["TEST"],
        },
        {
          text: "ABCD EFGH",
          expectedCaptures: ["ABCD"],
        },
      ],
    },
    {
      title: "問題3（レベル3）：4文字の小文字をキャプチャしよう",
      lines: [
        {
          text: "abcd xyz",
          expectedCaptures: ["abcd"],
        },
        {
          text: "test123",
          expectedCaptures: ["test"],
        },
      ],
    },
    {
      title: "問題4（レベル4）：1つ以上の数字をキャプチャしよう",
      lines: [
        {
          text: "合計は123個です",
          expectedCaptures: ["123"],
        },
        {
          text: "abc45xyz",
          expectedCaptures: ["45"],
        },
      ],
    },
    {
      title: "問題5（レベル5）：cat または dog をキャプチャしよう",
      lines: [
        {
          text: "I love cat.",
          expectedCaptures: ["cat"],
        },
        {
          text: "He loves dog.",
          expectedCaptures: ["dog"],
        },
      ],
    },
    {
      title: "問題6（レベル6）：日付（YYYY-MM-DD）を3つのグループに分けてキャプチャしよう",
      lines: [
        {
          text: "今日は2023-01-05です",
          expectedCaptures: ["2023", "01", "05"],
        },
        {
          text: "誕生日は1999-12-31です",
          expectedCaptures: ["1999", "12", "31"],
        },
      ],
    },
    {
      title: "問題7（レベル7）：メールアドレスをキャプチャしよう（1つのグループでOK）",
      lines: [
        {
          text: "連絡先: user@example.com",
          expectedCaptures: ["user@example.com"],
        },
        {
          text: "メール: test-user_01@sample.co.jp",
          expectedCaptures: ["test-user_01@sample.co.jp"],
        },
      ],
    },
    {
      title: "問題8（レベル8）：電話番号 (例: 03-1234-5678) を3つのグループに分けてキャプチャしよう",
      lines: [
        {
          text: "電話：03-1234-5678",
          expectedCaptures: ["03", "1234", "5678"],
        },
        {
          text: "TEL: 06-999-9999",
          expectedCaptures: ["06", "999", "9999"],
        },
      ],
    },
    {
      title: "問題9（レベル9）：2桁以上の数字をキャプチャしよう",
      lines: [
        {
          text: "在庫は12個あります",
          expectedCaptures: ["12"],
        },
        {
          text: "合計999人が参加",
          expectedCaptures: ["999"],
        },
      ],
    },
    {
      title: "問題10（レベル10）：同じ単語が2回連続するものを2つのグループでキャプチャしよう",
      lines: [
        {
          text: "abc abc",
          expectedCaptures: ["abc", "abc"],
        },
        {
          text: "xyz xyz",
          expectedCaptures: ["xyz", "xyz"],
        },
      ],
    },

    // ここから新規追加の5問（レベル11～15）
    {
      title: "問題11（レベル11）：5文字の回文を3つのグループに分けてキャプチャしよう",
      lines: [
        {
          // "abcba" => グループ1 = 'a', グループ2 = 'b', グループ3 = 'c'
          text: "abcba",
          expectedCaptures: ["a", "b", "c"],
        },
        {
          // "xyzzy" => グループ1 = 'x', グループ2 = 'y', グループ3 = 'z'
          text: "xyzzy",
          expectedCaptures: ["x", "y", "z"],
        },
      ],
    },
    {
      title: "問題12（レベル12）：HTMLの a タグをキャプチャしよう",
      lines: [
        {
          // href, title, タグの中身 の3つをキャプチャさせる例
          text: `<a href="https://example.com" title="サンプル">リンク</a>`,
          expectedCaptures: ["https://example.com", "サンプル", "リンク"],
        },
        {
          text: `<a href="http://test.jp" title="テスト">サンプル</a>`,
          expectedCaptures: ["http://test.jp", "テスト", "サンプル"],
        },
      ],
    },
    {
      title: "問題13（レベル13）：負の後読み (negative lookbehind) を使って 'bbb' をキャプチャしよう",
      lines: [
        {
          // 'aaa' の直後にある 'bbb' はマッチさせない
          text: "aaabbb",
          expectedCaptures: [],
        },
        {
          // こちらは 'bbb' の前に 'aaa' が無いのでキャプチャ
          text: "zzzbbb",
          expectedCaptures: ["bbb"],
        },
      ],
    },
    {
      title: "問題14（レベル14）：肯定先読み (positive lookahead) を使って、数字の後に '円' が続く箇所をキャプチャしよう",
      lines: [
        {
          text: "500円",
          expectedCaptures: ["500"],
        },
        {
          text: "1234円です",
          expectedCaptures: ["1234"],
        },
        {
          // 円500 は「数字の後に '円'」ではないのでキャプチャ期待なし
          text: "円500",
          expectedCaptures: [],
        },
      ],
    },
    {
      title: "問題15（レベル15）：8文字以上で英大文字・数字・特定記号(!@#$%)を含む文字列を1つキャプチャしよう",
      lines: [
        {
          // 条件をすべて満たす
          text: "Abcdef1!",
          expectedCaptures: ["Abcdef1!"],
        },
        {
          // 記号が無い
          text: "Password123",
          expectedCaptures: [],
        },
        {
          // 7文字しかない
          text: "Test#12",
          expectedCaptures: [],
        },
        {
          // 8文字以上 & 大文字・数字・# 記号 をすべて含む
          text: "OK#12345A",
          expectedCaptures: ["OK#12345A"],
        },
      ],
    },
  ],
};
