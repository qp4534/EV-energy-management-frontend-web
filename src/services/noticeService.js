// 공지사항과 관련된 api를 관리할 예정
// NOTICE, NOTICE_ATTACHMENT와 관련된 api를 관리할 예정
// 백엔드가 없을 때 임시로 사용하는 가짜(Mock) API 함수
export const createNotice = async (noticeData) => {
  console.log("백엔드로 전송될 데이터 미리보기:", noticeData);
  
  // 0.5초 뒤에 성공한 것처럼 가짜 응답을 보내줌
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "임시 저장 성공!" });
    }, 500);
  });
};