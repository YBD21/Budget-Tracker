import { CURRENT_USER } from '@/constants/queryKey';
import {
  createAccount,
  findAccount,
  loginUser,
  resetPassword,
  sendOtpEmail,
  verifyCaptcha,
  verifyOtp,
} from '@/services/user';
import { decodeUser, setHttpOnlyFindAccess } from '@/services/userServer';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAuthUser = () => {
  const queryClient = useQueryClient();

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      // const setCookiesStatus = setHttpOnlyUserData(data.accessToken);
      // if (setCookiesStatus) {
      const decodeData = await decodeUser(data.accessToken);
      queryClient.setQueryData([CURRENT_USER], decodeData);
      // }
    },
  });

  const verifyCaptchaMutation = useMutation({
    mutationFn: verifyCaptcha,
    onSuccess: (data) => {
      // eslint-disable-next-line no-unused-vars
      const setCookiesStatus = setHttpOnlyFindAccess(data.token);
    },
  });

  const createAccountMutation = useMutation({
    mutationFn: createAccount,
  });

  const findAccountMutation = useMutation({
    mutationFn: findAccount,
    onSuccess: (data) => {
      // eslint-disable-next-line no-unused-vars
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
