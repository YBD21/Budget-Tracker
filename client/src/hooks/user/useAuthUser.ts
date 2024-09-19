import {
  createAccount,
  findAccount,
  loginUser,
  resetPassword,
  sendOtpEmail,
  verifyCaptcha,
  verifyOtp,
} from '@/services/authUser';
import { setHttpOnlyFindAccess, setHttpOnlyUserData } from '@/services/userServer';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAuthUser = () => {
  const queryClient = useQueryClient();

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      const setCookiesStatus = await setHttpOnlyUserData(data.accessToken);
    },
  });

  const verifyCaptchaMutation = useMutation({
    mutationFn: verifyCaptcha,
    onSuccess: (data) => {
      const setCookiesStatus = setHttpOnlyFindAccess(data.token);
    },
  });

  const createAccountMutation = useMutation({
    mutationFn: createAccount,
  });

  const findAccountMutation = useMutation({
    mutationFn: findAccount,
    onSuccess: (data) => {
      const setCookiesStatus = setHttpOnlyFindAccess(data.token);
    },
  });

  const sendOtpEmailMutation = useMutation({
    mutationFn: sendOtpEmail,
  });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
  });

  const logoutUserMutation = () => queryClient.clear();

  return {
    verifyCaptchaMutation,
    logoutUserMutation,
    loginUserMutation,
    findAccountMutation,
    sendOtpEmailMutation,
    verifyOtpMutation,
    resetPasswordMutation,
    createAccountMutation,
  };
};
