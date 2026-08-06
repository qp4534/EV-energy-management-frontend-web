import { useEffect, useState } from "react";
import { useProfile, useUpdateProfile } from "../hooks/queries/useUser";
import PasswordInput from "../components/auth/PasswordInput";
import AuthButton from "../components/auth/AuthButton";
import { formatPhoneNumber } from "../utils/phone";
import "../styles/MyPage.css";

export default function MyPage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [form, setForm] = useState({ name: "", phone: "", profileImageUrl: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        phone: profile.phone ?? "",
        profileImageUrl: profile.profileImageUrl ?? "",
      });
    }
  }, [profile]);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const updatePassword = (key) => (e) =>
    setPasswordForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await updateProfile.mutateAsync({
        name: form.name,
        phone: form.phone,
        profileImageUrl: form.profileImageUrl,
      });
      setMessage("회원정보가 수정되었습니다.");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (passwordForm.newPassword !== passwordForm.newPasswordConfirm) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await updateProfile.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", newPasswordConfirm: "" });
      setMessage("비밀번호가 변경되었습니다.");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (isLoading) {
    return <div className="mypage">불러오는 중...</div>;
  }

  return (
    <div className="mypage">
      <h1 className="mypage-title">마이페이지</h1>

      <form className="mypage-section" onSubmit={handleProfileSubmit}>
        <h2>기본 정보</h2>
        <label>
          <span>이메일</span>
          <input value={profile?.email ?? ""} disabled />
        </label>
        <label>
          <span>이름</span>
          <input value={form.name} onChange={update("name")} />
        </label>
        <label>
          <span>전화번호</span>
          <input
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: formatPhoneNumber(e.target.value) }))
            }
            placeholder="010-0000-0000"
            maxLength={13}
          />
        </label>
        <label>
          <span>프로필 이미지 URL</span>
          <input value={form.profileImageUrl} onChange={update("profileImageUrl")} placeholder="https://..." />
        </label>
        <AuthButton variant="primary" type="submit">
          저장
        </AuthButton>
      </form>

      <form className="mypage-section" onSubmit={handlePasswordSubmit}>
        <h2>비밀번호 변경</h2>
        <label>
          <span>현재 비밀번호</span>
          <PasswordInput
            value={passwordForm.currentPassword}
            onChange={updatePassword("currentPassword")}
            placeholder="현재 비밀번호"
          />
        </label>
        <label>
          <span>새 비밀번호</span>
          <PasswordInput
            value={passwordForm.newPassword}
            onChange={updatePassword("newPassword")}
            placeholder="8자리 이상, 대/소문자·숫자·특수문자 포함"
          />
        </label>
        <label>
          <span>새 비밀번호 확인</span>
          <PasswordInput
            value={passwordForm.newPasswordConfirm}
            onChange={updatePassword("newPasswordConfirm")}
            placeholder="비밀번호 재입력"
          />
        </label>
        <AuthButton variant="primary" type="submit">
          비밀번호 변경
        </AuthButton>
      </form>

      {message && <p className="mypage-message">{message}</p>}
      {error && <p className="mypage-error">{error}</p>}
    </div>
  );
}
