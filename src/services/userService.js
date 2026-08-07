// 로그인. 회원가입, 토큰 관리 등 회원 관리와 관련된 api를 관리할 예정
// USER, LOGIN_LOGS, ACTION_LOGS 등과 관련된 api를 관리할 예정
import api from "../api/axios";

// 백엔드 연동 전까지 사용하는 mock 함수들 (로그인/회원가입 화면 UI 흐름 확인용)

// ERD의 USER.role ENUM 실제 값('관리자','관제자','이용자' 중 웹에서 쓰는 2개).
// 화면 내부 라우팅은 Sidebar/Header/App.jsx가 이미 쓰고 있는 영문 값
// (administrator/controller)을 그대로 쓰고, 여기서 DB로 나가는 값만 한글로 변환.
export const ROLE_DB_VALUE = {
  administrator: "관리자",
  controller: "관제자",
};

export const DB_ROLE_TO_UI = {
  관리자: "administrator",
  관제자: "controller",
};

// 8자리 이상 + 대문자/소문자/숫자/특수문자 모두 포함 (백엔드 AuthService의 PASSWORD_POLICY와 동일한 규칙)
const PASSWORD_POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
export const PASSWORD_POLICY_MESSAGE =
  "비밀번호는 8자리 이상이며 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.";

export const userService = {
  async signup({ role, name, email, phone, birth, password, passwordConfirm, consentedTerms }) {
    if (!name || !email || !phone || !password) {
      return Promise.reject(new Error("필수 항목을 모두 입력해주세요."));
    }
    if (password !== passwordConfirm) {
      return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
    }
    if (!PASSWORD_POLICY.test(password)) {
      return Promise.reject(new Error(PASSWORD_POLICY_MESSAGE));
    }
    const response = await api.post("/api/auth/signup", {
      email,
      password,
      name,
      phone,
      birth,
      role: ROLE_DB_VALUE[role],
      consentedTerms,
    });
    return response.data;
  },

  async login({ email, password }) {
    if (!email || !password) {
      return Promise.reject(new Error("이메일과 비밀번호를 입력해주세요."));
    }
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  },

  async logout() {
    await api.post("/api/auth/logout");
  },

  async getMe() {
    const response = await api.get("/api/auth/me");
    return response.data;
  },

  async updateProfile(payload) {
    if (payload.newPassword && !PASSWORD_POLICY.test(payload.newPassword)) {
      return Promise.reject(new Error(PASSWORD_POLICY_MESSAGE));
    }
    const response = await api.patch("/api/auth/me", payload);
    return response.data;
  },
};

// 백엔드 연동 전까지 사용하는 mock 함수들 (아이디 찾기/비밀번호 재설정 화면 UI 흐름 확인용)
// 이번 작업 범위 밖 - 그대로 유지

export function mockFindId({ role, name, birth, phone }) {
  if (!name || !birth || !phone) {
    return Promise.reject(new Error("이름, 생년월일, 휴대폰 번호를 입력해주세요."));
  }
  return Promise.resolve({
    role: ROLE_DB_VALUE[role],
    userId: "gogildong123@naver.com",
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

// ================================================================
// 아래부터는 관리자 이용자 관리(UserManage.jsx) 전용 실제 API 함수.
// 위 mock 함수들과 달리 실제 백엔드(UserController)를 호출한다.
//
// 알려진 이슈 (백엔드 확인 필요):
// 1) UserDto에 name 필드가 없어서 목록 화면에 이름을 못 채운다.
//    GET /api/users 응답에서 email 앞부분을 임시 표시 이름으로 대체 중.
// 2) role 값 체계가 백엔드 mock("이용자"/"관리자")과 프론트 필터
//    ("전체"/"관리자"/"관제자"/"차주")가 다르다. 실제 ENUM 확정 전까지
//    "관제자"/"차주" 필터는 정상 동작하지 않을 수 있다.
// 3) UserDto.passwordHash가 응답에 그대로 노출된다 — 보안 이슈,
//    백엔드에 응답 전용 DTO 분리 요청 필요.
// ================================================================

export const getUsers = async () => {
  const { data } = await api.get("/api/users");
  return data;
};

export const getUser = async (userId) => {
  const { data } = await api.get(`/api/users/${userId}`);
  return data;
};

export const updateUser = async (userId, payload) => {
  const { data } = await api.put(`/api/users/${userId}`, payload);
  return data;
};

export const deleteUser = async (userId) => {
  await api.delete(`/api/users/${userId}`);
};

// TODO: 백엔드에 아직 이 엔드포인트가 없음. UserController에
// POST /api/users/{userId}/password-reset 추가 요청 필요.
// 그 전까지는 호출하면 404가 날 수 있음(정상 — 백엔드 작업 후 해결됨).
export const requestPasswordReset = async (userId) => {
  const { data } = await api.post(`/api/users/${userId}/password-reset`);
  return data;
};