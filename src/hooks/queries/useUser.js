// userService 결과를 컴포넌트에 전달
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";

// 내 프로필 조회/수정 (MyPage.jsx 전용)
export const useProfile = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: userService.getMe,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });
};

// 회원 목록 조회
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

// 권한/역할 저장
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }) => updateUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// 회원 탈퇴
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// 비밀번호 재설정 링크 전송
// TODO: 백엔드에 POST /api/users/{userId}/password-reset 아직 없음 (userService.js 참고)
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (userId) => userService.requestPasswordReset(userId),
  });
};