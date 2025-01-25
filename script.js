// 要素の取得
const regexInput = document.getElementById('regexInput');
const testContainer = document.getElementById('testContainer');
const errorMessage = document.getElementById('errorMessage');

// 入力欄の内容が変化するたびにハイライト処理を実行
regexInput.addEventListener('input', () => {
  const pattern = regexInput.value.trim();
  errorMessage.textContent = ''; // エラー表示をリセット

  let regex = null;
  if (pattern) {
    try {
      // グローバル検索(g)を付けてマッチ結果を置換でハイライト
      regex = new RegExp(pattern, 'g');
    } catch (e) {
      // 正規表現の文法エラーがあれば表示
      errorMessage.textContent = '正規表現エラー: ' + e.message;
    }
  }

  // テスト文字列をすべて取得
  const lines = testContainer.getElementsByClassName('text-line');
  for (let line of lines) {
    const originalText = line.getAttribute('data-text');

    // 正規表現が無効ならハイライトせずそのまま表示
    if (!regex) {
      line.innerHTML = originalText;
      // 既存の○×アイコンがあれば削除しておく
      const existingIcon = line.querySelector('.result-icon');
      if (existingIcon) existingIcon.remove();
      continue;
    }

    // 置換でマッチ部分を<span>タグに包み、ハイライトさせる
    const highlighted = originalText.replace(regex, (match) => {
      return `<span class="highlight">${match}</span>`;
    });
    line.innerHTML = highlighted;

    // 行末に○×アイコンを表示(1つでもマッチすれば○, しなければ×)
    regex.lastIndex = 0; // replaceで変化した可能性があるのでリセット
    const isMatch = regex.test(originalText);

    // 既存アイコンを削除
    const existingIcon = line.querySelector('.result-icon');
    if (existingIcon) {
      existingIcon.remove();
    }

    // 新しい○×アイコン
    const icon = document.createElement('span');
    icon.classList.add('result-icon');
    if (isMatch) {
      icon.textContent = '○';
    } else {
      icon.textContent = '×';
      icon.classList.add('ng');
    }
    line.appendChild(icon);
  }
});
