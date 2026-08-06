// userService 결과를 컴포넌트에 전달
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";

// 로그인/회원가입/로그아웃은 캐싱할 게 없는 1회성 액션이라 훅으로 감싸지 않고
// Login.jsx/SignupInfo.jsx/Header.jsx에서 userService를 직접 호출한다.

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
