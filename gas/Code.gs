/** 水谷眼科診療所 患者様アンケート回答保存用 Google Apps Script */
var SHEET_HEADERS = [
  '回答日時', '性別', '年代', '待ち時間満足度', 'スタッフ対応満足度',
  '合計スコア', '平均スコア', '当院を選んだ理由', 'その他理由', '自由記述'
];

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('送信データがありません。');
    }
    var data = JSON.parse(e.postData.contents);
    var waitingTime = Number(data.waitingTimeRating != null ? data.waitingTimeRating : data.medicalCareRating);
    var staff = Number(data.staffRating);
    if (!Number.isFinite(waitingTime) || waitingTime < 1 || waitingTime > 10 || !Number.isFinite(staff) || staff < 1 || staff > 10) {
      throw new Error('必須評価が不正です。');
    }
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) throw new Error('スプレッドシートが見つかりません。');
    var sheet = spreadsheet.getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(SHEET_HEADERS);
      sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    var reasons = Array.isArray(data.reasons) ? data.reasons.join('、') : '';
    sheet.appendRow([
      data.submittedAt ? new Date(data.submittedAt) : new Date(),
      String(data.gender || ''), String(data.ageGroup || ''), waitingTime, staff,
      waitingTime + staff, Number(((waitingTime + staff) / 2).toFixed(2)), reasons,
      String(data.otherReason || ''), String(data.comments || '').slice(0, 1000)
    ]);
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: '水谷眼科診療所 患者様アンケート' });
}
