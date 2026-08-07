// "01012345678" -> "010-1234-5678" 형태로 입력 중에 하이픈을 자동으로 채워준다.
export function formatPhoneNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}
