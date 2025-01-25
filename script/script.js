/***************************************************
 * 1) レッスン配列を作成 (グローバル変数からまとめる)
 ***************************************************/
const lessons = [window.lesson1, window.lesson2];

/***************************************************
 * 2) DOM要素の取得
 ***************************************************/
const lessonSelect = document.getElementById("lessonSelect");
const lessonTitle = document.getElementById("lessonTitle");
const lessonDescription = document.getElementById("lessonDescription");
const regexInput = document.getElementById("regexInput");
const errorMessage = document.getElementById("errorMessage");
const problemsContainer = document.getElementById("problemsContainer");

// 最初に選択するレッスンID (例: 1番目)
let currentLessonId = lessons[0].id;

/***************************************************
 * 3) レッスン選択ドロップダウンを初期化
 ***************************************************/
lessons.forEach((lesson) => {
  const option = document.createElement("option");
  option.value = lesson.id;
  option.textContent = lesson.title;
  lessonSelect.appendChild(option);
});
lessonSelect.value = currentLessonId;

/***************************************************
 * 4) レッスン表示関数
 ***************************************************/
function renderLesson(lessonId) {
  const lessonData = lessons.find((l) => l.id === Number(lessonId));
  if (!lessonData) return;

  // タイトル＆説明文
  lessonTitle.textContent = lessonData.title;
  lessonDescription.innerHTML = lessonData.description;

  // 問題一覧をクリア
  problemsContainer.innerHTML = "";

  // レッスンに含まれる各問題を描画
  lessonData.problems.forEach((problem, problemIndex) => {
    const problemDiv = document.createElement("div");
    problemDiv.classList.add("problem-item");
    // 識別用ID
    problemDiv.id = `problem-${lessonId}-${problemIndex}`;

    // 問題タイトル
    const problemTitle = document.createElement("div");
    problemTitle.classList.add("problem-title");
    problemTitle.textContent = problem.title;
    problemDiv.appendChild(problemTitle);

    // テスト行の表示
    problem.lines.forEach((line, lineIndex) => {
      const lineDiv = document.createElement("div");
      lineDiv.classList.add("test-line");
      lineDiv.id = `line-${lessonId}-${problemIndex}-${lineIndex}`;
      lineDiv.textContent = line.text;
      problemDiv.appendChild(lineDiv);
    });

    // 合否表示 (問題全体のOK/NG)
    const problemResult = document.createElement("div");
    problemResult.classList.add("result");
    problemDiv.appendChild(problemResult);

    // キャプチャ結果テーブル
    const tableEl = document.createElement("table");
    tableEl.classList.add("capture-table");
    tableEl.innerHTML = `
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
    problemDiv.appendChild(tableEl);

    // DOMに追加
    problemsContainer.appendChild(problemDiv);
  });

  // レッスンを切り替えたら、現在入力している正規表現で再判定
  updateCaptureResults();
}

/***************************************************
 * 5) 正規表現判定用の関数
 ***************************************************/
function updateCaptureResults() {
  const pattern = regexInput.value.trim();
  errorMessage.textContent = "";

  let regex = null;
  if (pattern) {
    try {
      regex = new RegExp(pattern);
    } catch (e) {
      errorMessage.textContent = "正規表現エラー: " + e.message;
    }
  }

  const lessonData = lessons.find((l) => l.id === Number(currentLessonId));
  if (!lessonData) return;

  // レッスン内の各問題をチェック
  lessonData.problems.forEach((problem, problemIndex) => {
    // 問題全体の合否
    let problemOverallOk = true;

    const problemDiv = document.getElementById(`problem-${currentLessonId}-${problemIndex}`);
    if (!problemDiv) return;

    const problemResult = problemDiv.querySelector(".result");
    const tableBody = problemDiv.querySelector("tbody");
    tableBody.innerHTML = ""; // テーブルを初期化

    if (!regex) {
      // 正規表現が無効(エラー含む)なら表示をクリア
      problemResult.textContent = "";
      problemResult.className = "result";
      return;
    }

    // 各行(line)を判定
    problem.lines.forEach((line, lineIndex) => {
      // 正規表現をexec
      const match = regex.exec(line.text);
      // 次回のexecに影響が出ないようにlastIndexをリセット
      regex.lastIndex = 0;

      if (!match) {
        // マッチしない
        problemOverallOk = false;
        // テーブルに1行だけ入れる（キャプチャなしの場合）
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${lineIndex + 1}</td>
          <td colspan="3">マッチなし</td>
          <td style="color:red">×</td>
        `;
        tableBody.appendChild(row);
      } else {
        // キャプチャ結果
        const captures = match.slice(1); // [1]以降が実際のグループ
        const expected = line.expectedCaptures;
        
        let lineOk = true;

        // 比較回数＝期待の数 or 実際の数 の大きい方
        const loopCount = Math.max(expected.length, captures.length);
        for (let i = 0; i < loopCount; i++) {
          const expVal = expected[i] || "";
          const actVal = captures[i] || "";

          const row = document.createElement("tr");
          // 行番号
          const lineTd = document.createElement("td");
          lineTd.textContent = (i === 0) ? (lineIndex + 1) : ""; 
          // ↑ 同一行について複数グループがある場合、最初だけ行番号を表示する
          row.appendChild(lineTd);

          // グループ番号
          const groupTd = document.createElement("td");
          groupTd.textContent = i + 1;
          row.appendChild(groupTd);

          // 期待値
          const expTd = document.createElement("td");
          expTd.textContent = expVal;
          row.appendChild(expTd);

          // 実際キャプチャ
          const actTd = document.createElement("td");
          actTd.textContent = actVal;
          row.appendChild(actTd);

          // 合否
          const statusTd = document.createElement("td");
          if (expVal !== "" && expVal === actVal) {
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
          problemOverallOk = false;
        }
      }
    });

    // 問題全体の合否表示
    if (problemOverallOk) {
      problemResult.textContent = "○ 正解 (全行のキャプチャ一致)";
      problemResult.className = "result ok";
    } else {
      problemResult.textContent = "× キャプチャ不一致 (一部の行がマッチ失敗または誤り)";
      problemResult.className = "result ng";
    }
  });
}

/***************************************************
 * 6) イベントハンドラ
 ***************************************************/
// レッスン切り替え
lessonSelect.addEventListener("change", () => {
  currentLessonId = Number(lessonSelect.value);
  renderLesson(currentLessonId);
});

// 正規表現入力
regexInput.addEventListener("input", updateCaptureResults);

/***************************************************
 * 7) 初期表示
 ***************************************************/
renderLesson(currentLessonId);
