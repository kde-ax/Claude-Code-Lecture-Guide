const admin = require('firebase-admin');

// 1. Firebase Admin 초기화
admin.initializeApp();

const db = admin.firestore();

async function seedUser() {
    const userEmail = 'cky@ccfm.co.kr';
    const userData = {
        '식별자': userEmail,
        '이름': '최기영',
        '직책': '',
        '직군': '영상디자이너',
        '레벨': 'L3',
        '권한': '영상디자이너L3'
    };

    try {
        await db.collection('users').doc(userEmail).set(userData);
        console.log(`성공: ${userEmail} 데이터가 Firestore에 저장되었습니다.`);
    } catch (error) {
        console.error('에러 발생:', error);
    }
}

seedUser();
