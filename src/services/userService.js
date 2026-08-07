// 로그인. 회원가입, 토큰 관리 등 회원 관리와 관련된 api를 관리할 예정
// USER, LOGIN_LOGS, ACTION_LOGS 등과 관련된 api를 관리할 예정
import api from "../api/axios";

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

  async sendVerificationCode(email) {
    if (!email) {
      return Promise.reject(new Error("이메일을 입력해주세요."));
    }
    // 메일 발송(SMTP 핸드셰이크 포함)은 일반 API 호출보다 오래 걸릴 수 있어서
    // 기본 5초 타임아웃 대신 이 호출만 넉넉하게 준다.
    await api.post("/api/auth/email/send-code", { email }, { timeout: 15000 });
  },

  async verifyEmailCode(email, code) {
    if (!code) {
      return Promise.reject(new Error("인증번호를 입력해주세요."));
    }
    await api.post("/api/auth/email/verify-code", { email, code });
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

  async deleteAccount(currentPassword) {
    if (!currentPassword) {
      return Promise.reject(new Error("비밀번호를 입력해주세요."));
    }
    await api.delete("/api/auth/me", { data: { currentPassword } });
  },

  async findEmail({ role, name, birth, phone }) {
    if (!name || !birth || !phone) {
      return Promise.reject(new Error("이름, 생년월일, 휴대폰 번호를 입력해주세요."));
    }
    const response = await api.post("/api/auth/find-email", {
      name,
      phone,
      birth,
      role: ROLE_DB_VALUE[role],
    });
    return response.data;
  },

  async requestPasswordReset(email) {
    if (!email) {
      return Promise.reject(new Error("이메일을 입력해주세요."));
    }
    // 회원가입 이메일 인증과 동일하게 메일 발송이 걸려서 타임아웃을 넉넉하게 준다.
    await api.post("/api/auth/password/reset/send-code", { email }, { timeout: 15000 });
  },

  async resetPassword({ email, password, passwordConfirm }) {
    if (password !== passwordConfirm) {
      return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
    }
    if (!PASSWORD_POLICY.test(password)) {
      return Promise.reject(new Error(PASSWORD_POLICY_MESSAGE));
    }
    await api.post("/api/auth/password/reset", { email, newPassword: password });
  },
};
