const functions = require("firebase-functions/v1");
const { google } = require('googleapis');

exports.saveToSheet = functions.https.onRequest(async (req, res) => {
    try {
        // 1. 구글 서버 내부 권한 사용
        const auth = new google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        // 2. 스프레드시트 ID
        const spreadsheetId = '1MnfpTmPqrZHMWiGcxucebbwA7tUI4gjnZp6gV_fm42s';

        // 3. 테스트 데이터 기록
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A1',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[new Date().toISOString(), "헬로 파이어베이스!"]]
            }
        });

        res.status(200).send("성공적으로 기록되었습니다.");
    } catch (error) {
        console.error(error);
        res.status(500).send("에러 발생: " + error.message);
    }
});