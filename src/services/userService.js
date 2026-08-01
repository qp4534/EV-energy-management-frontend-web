// 로그인. 회원가입, 토큰 관리 등 회원 관리와 관련된 api를 관리할 예정
// USER, LOGIN_LOGS, ACTION_LOGS 등과 관련된 api를 관리할 예정

// 백엔드 연동 전까지 사용하는 mock 함수들 (로그인/회원가입 화면 UI 흐름 확인용)

// ERD의 USER.role ENUM 실제 값('관리자','관제자','이용자' 중 웹에서 쓰는 2개).
// 화면 내부 라우팅은 Sidebar/Header/App.jsx가 이미 쓰고 있는 영문 값
// (administrator/controller)을 그대로 쓰고, 여기서 DB로 나가는 값만 한글로 변환.
const ROLE_DB_VALUE = {
  administrator: "관리자",
  controller: "관제자",
};

export function mockLogin({ role, email, password }) {
  if (!email || !password) {
    return Promise.reject(new Error("이메일과 비밀번호를 입력해주세요."));
  }
  return Promise.resolve({ role: ROLE_DB_VALUE[role], email });
}

export function mockFindId({ role, email }) {
  if (!email) {
    return Promise.reject(new Error("이메일을 입력해주세요."));
  }
  return Promise.resolve({
    role: ROLE_DB_VALUE[role],
    userId: "gogildong123",
    name: "고길동",
  });
}

export function mockRequestPasswordReset({ role, userId, email }) {
  if (!userId || !email) {
    return Promise.reject(new Error("아이디와 이메일을 입력해주세요."));
  }
  return Promise.resolve({ role: ROLE_DB_VALUE[role], sent: true });
}

export function mockResetPassword({ password, passwordConfirm }) {
  if (!password || password.length < 8) {
    return Promise.reject(new Error("비밀번호는 8자리 이상 입력해주세요."));
  }
  if (password !== passwordConfirm) {
    return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
  }
  return Promise.resolve({ success: true });
}

// isAgree: ERD의 USER.is_agree(단일 boolean)에 대응.
// 화면에서는 항목별(만14세/서비스약관/개인정보/위치기반)로 따로 체크하지만,
// 회원가입 정보입력 화면까지 왔다는 건 필수 항목에는 이미 동의했다는 뜻이라
// 여기서는 항상 true로 넘어옴 (SignupInfo.jsx 참고)
export function mockSignup({ role, name, email, phone, birth, password, passwordConfirm, isAgree }) {
  if (!name || !email || !phone || !password) {
    return Promise.reject(new Error("필수 항목을 모두 입력해주세요."));
  }
  if (password !== passwordConfirm) {
    return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
  }
  return Promise.resolve({
    role: ROLE_DB_VALUE[role],
    name,
    email,
    phone,
    birth,
    isAgree,
  });
}
