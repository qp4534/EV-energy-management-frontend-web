// userService 결과를 컴포넌트에 전달
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";


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

// 관리자 - 이용자 관리(UserManage.jsx)

// 회원 목록 조회
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers,
  });
};

// 권한/역할 저장
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }) => userService.updateUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// 회원 탈퇴
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// 비밀번호 재설정 링크 전송 (관리자가 다른 유저 대상으로 보내는 것)
// userService.requestPasswordReset(email)은 본인이 직접 요청하는 별개 함수라
// 여기서는 반드시 adminRequestPasswordReset을 써야 함 (userService.js 주석 참고).
// TODO: 백엔드에 POST /api/users/{userId}/password-reset 아직 없음
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (userId) => userService.adminRequestPasswordReset(userId),
  });
};