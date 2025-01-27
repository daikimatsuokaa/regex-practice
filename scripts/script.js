/***************************************************
 * 1) レッスン配列を作成
 ***************************************************/
// 先に読み込まれた window.lesson1, window.lesson2 ... をまとめる
const lessons = [window.lesson1, window.lesson2];

// デフォルトで選択するレッスンID
let currentLessonId = lessons[0].id;

/***************************************************
 * 2) DOM要素の取得
 ***************************************************/
const lessonSelect = document.getElementById("lessonSelect");
const lessonTitle = document.getElementById("lessonTitle");
const lessonDescription = document.getElementById("lessonDescription");
const problemsContainer = document.getElementById("problemsContainer");

/***************************************************
 * 3) レッスン選択ドロップダウンに項目を追加
 ***************************************************/
lessons.forEach((lesson) => {
  const option = document.createElement("option");
  option.value = lesson.id;
  option.textContent = lesson.title;
  lessonSelect.appendChild(option);
});
// ドロップダウンの初期選択
lessonSelect.value = currentLessonId;

/***************************************************
 * 4) レッスン表示処理
 ***************************************************/
function renderLesson(lessonId) {
  const lessonData = lessons.find((l) => l.id === Number(lessonId));
  if (!lessonData) {
    lessonTitle.textContent = "レッスンが見つかりません";
    lessonDescription.textContent = "";
    problemsContainer.innerHTML = "";
    return;
  }

  // タイトル・説明を表示
  lessonTitle.textContent = lessonData.title;
  lessonDescription.innerHTML = lessonData.description;

  // 問題一覧をクリア
  problemsContainer.innerHTML = "";

  // 問題ごとに描画
  lessonData.problems.forEach((problem, pIndex) => {
    // メインのコンテナ
    const problemDiv = document.createElement("div");
    problemDiv.classList.add("problem-item");
    problemDiv.id = `problem-${lessonId}-${pIndex}`;

    // 問題タイトル
    const problemTitleEl = document.createElement("div");
    problemTitleEl.classList.add("problem-title");
    problemTitleEl.textContent = problem.title;
    problemDiv.appendChild(problemTitleEl);

    // 各テスト行の表示
    problem.lines.forEach((line, lineIndex) => {
      // 行テキストを表示
      const lineDiv = document.createElement("div");
      lineDiv.classList.add("test-line");
      lineDiv.id = `line-${lessonId}-${pIndex}-${lineIndex}`;
      lineDiv.textContent = line.text;
      problemDiv.appendChild(lineDiv);

      // === ここから追加：期待値を表示する要素 ===
      if (Array.isArray(line.expectedCaptures) && line.expectedCaptures.length > 0) {
        const expectedDiv = document.createElement("div");
        expectedDiv.classList.add("expected-captures");
        // 例: "期待値: 1234, abcd, ..." のように表示
        expectedDiv.textContent = "期待値: " + line.expectedCaptures.join(", ");
        problemDiv.appendChild(expectedDiv);
      }
      // === ここまで追加部分 ===
    });

    // 問題全体の合否表示 (あとで更新)
    const resultEl = document.createElement("div");
    resultEl.classList.add("result");
    problemDiv.appendChild(resultEl);

    // キャプチャ結果テーブル
    const table = document.createElement("table");
    table.classList.add("capture-table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>行</th>
          <th>グループ #</th>
          <th>期待値</th>
          <th>実際のキャプチャ</th>
          <th>合否</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    problemDiv.appendChild(table);

    // 各問題ごとの正規表現入力欄
    const regexInputArea = document.createElement("div");
    regexInputArea.classList.add("regex-input-area");

    const label = document.createElement("label");
    label.textContent = "正規表現パターン：";

    const problemRegexInput = document.createElement("input");
    problemRegexInput.type = "text";
    problemRegexInput.classList.add("regex-input");
    problemRegexInput.placeholder = "ここに正規表現を入力...";

    const errorSpan = document.createElement("span");
    errorSpan.classList.add("error-message");

    // 入力が変わるたびにキャプチャ結果を更新
    problemRegexInput.addEventListener("input", () => {
      updateCaptureResultsForProblem(lessonId, pIndex);
    });

    label.appendChild(problemRegexInput);
    regexInputArea.appendChild(label);
    regexInputArea.appendChild(errorSpan);
    problemDiv.appendChild(regexInputArea);

    // コンテナに追加
    problemsContainer.appendChild(problemDiv);
  });
}

/***************************************************
 * 5) 問題ごとの正規表現判定
 ***************************************************/
function updateCaptureResultsForProblem(lessonId, pIndex) {
  // 現在のレッスン＆問題データを取得
  const lessonData = lessons.find((l) => l.id === Number(lessonId));
  if (!lessonData) return;

  const problem = lessonData.problems[pIndex];
  if (!problem) return;

  // 対象の problem-item コンテナを特定
  const problemDiv = document.getElementById(`problem-${lessonId}-${pIndex}`);
  // 入力欄、エラーメッセージ、合否表示、テーブル要素を取得
  const problemRegexInput = problemDiv.querySelector(".regex-input");
  const errorSpan = problemDiv.querySelector(".error-message");
  const resultEl = problemDiv.querySelector(".result");
  const tableBody = problemDiv.querySelector("tbody");

  // 初期化
  errorSpan.textContent = "";
  tableBody.innerHTML = "";

  // ユーザー入力パターン
  const pattern = problemRegexInput.value.trim();
  let regex = null;

  // パターンが空であれば評価しない（合否クリア）
  if (!pattern) {
    resultEl.textContent = "";
    resultEl.className = "result";
    return;
  }

  // 正規表現が有効かチェック
  try {
    regex = new RegExp(pattern);
  } catch (e) {
    // コンパイルエラー
    errorSpan.textContent = "正規表現エラー: " + e.message;
    resultEl.textContent = "";
    resultEl.className = "result";
    return;
  }

  // 問題全体の合否フラグ
  let problemOk = true;

  // 各行をチェック
  problem.lines.forEach((line, lineIndex) => {
    const match = regex.exec(line.text);
    // 毎回リセット（次の行の判定に影響しないように）
    regex.lastIndex = 0;

    if (!match) {
      // マッチしない場合
      problemOk = false;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${lineIndex + 1}</td>
        <td colspan="3">マッチなし</td>
        <td style="color:red">×</td>
      `;
      tableBody.appendChild(row);
    } else {
      // キャプチャ結果を評価
      const captures = match.slice(1);
      const expected = line.expectedCaptures;
      let lineOk = true;
      const loopCount = Math.max(captures.length, expected.length);

      for (let i = 0; i < loopCount; i++) {
        const expVal = expected[i] || "";
        const actVal = captures[i] || "";

        const row = document.createElement("tr");
        // 行番号（最初のグループだけ表示）
        const lineTd = document.createElement("td");
        lineTd.textContent = i === 0 ? lineIndex + 1 : "";
        row.appendChild(lineTd);

        // グループ番号
        const groupTd = document.createElement("td");
        groupTd.textContent = i + 1;
        row.appendChild(groupTd);

        // 期待値
        const expTd = document.createElement("td");
        expTd.textContent = expVal;
        row.appendChild(expTd);

        // 実際のキャプチャ
        const actTd = document.createElement("td");
        actTd.textContent = actVal;
        row.appendChild(actTd);

        // 合否
        const statusTd = document.createElement("td");
        if (expVal && expVal === actVal) {
          statusTd.textContent = "○";
          statusTd.style.color = "green";
        } else {
          statusTd.textContent = "×";
          statusTd.style.color = "red";
          lineOk = false;
        }
        row.appendChild(statusTd);

        tableBody.appendChild(row);
      }

      if (!lineOk || captures.length !== expected.length) {
        problemOk = false;
      }
    }
  });

  // 問題全体の合否を表示
  if (problemOk) {
    resultEl.textContent = "○ 正解 (全行キャプチャ一致)";
    resultEl.className = "result ok";
  } else {
    resultEl.textContent = "× キャプチャ不一致";
    resultEl.className = "result ng";
  }
}

/***************************************************
 * 6) イベント設定
 ***************************************************/
// レッスン切り替え時
lessonSelect.addEventListener("change", () => {
  currentLessonId = Number(lessonSelect.value);
  renderLesson(currentLessonId);
});

/***************************************************
 * 7) 初期表示
 ***************************************************/
renderLesson(currentLessonId);
