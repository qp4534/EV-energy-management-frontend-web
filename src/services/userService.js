// 로그인. 회원가입, 토큰 관리 등 회원 관리와 관련된 api를 관리할 예정
// USER, LOGIN_LOGS, ACTION_LOGS 등과 관련된 api를 관리할 예정

// 백엔드 연동 전까지 사용하는 mock 함수들 (로그인/회원가입 화면 UI 흐름 확인용)

export function mockLogin({ role, email, password }) {
  if (!email || !password) {
    return Promise.reject(new Error("이메일과 비밀번호를 입력해주세요."));
  }
  return Promise.resolve({ role, email });
}

export function mockFindId({ role, email }) {
  if (!email) {
    return Promise.reject(new Error("이메일을 입력해주세요."));
  }
  return Promise.resolve({ role, userId: "gogildong123", name: "고길동" });
}

export function mockRequestPasswordReset({ role, userId, email }) {
  if (!userId || !email) {
    return Promise.reject(new Error("아이디와 이메일을 입력해주세요."));
  }
  return Promise.resolve({ role, sent: true });
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

export function mockSignup({ role, name, email, phone, birth, password, passwordConfirm }) {
  if (!name || !email || !phone || !password) {
    return Promise.reject(new Error("필수 항목을 모두 입력해주세요."));
  }
  if (password !== passwordConfirm) {
    return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
  }
  return Promise.resolve({ role, name, email, phone, birth });
}
