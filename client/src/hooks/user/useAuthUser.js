import { CURRENT_USER } from '@/constants/queryKey'
import {
  findAccount,
  loginUser,
  sendOtpEmail,
  verifyCaptcha,
  verifyOtp,
} from '@/services/user'
import {
  decodeUser,
  setHttpOnlyFindAccess,
  setHttpOnlyUserData,
} from '@/services/userServer'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAuthUser = () => {
  const queryClient = useQueryClient()

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      const setCookiesStatus = setHttpOnlyUserData(data.accessToken)
      if (setCookiesStatus) {
        const decodeData = await decodeUser(data.accessToken)
        queryClient.setQueryData([CURRENT_USER], decodeData)
      }
    },
  })

  const verifyCaptchaMutation = useMutation({
    mutationFn: verifyCaptcha,
    onSuccess: (data) => {
      const setCookiesStatus = setHttpOnlyFindAccess(data.token)
    },
  })

  const findAccountMutation = useMutation({
    mutationFn: findAccount,
    onSuccess: (data) => {
      const setCookiesStatus = setHttpOnlyFindAccess(data.token)
    },
  })

  const logoutUserMutation = () => queryClient.clear()

  const sendOtpEmailMutation = useMutation({
    mutationFn: sendOtpEmail,
  })

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
  })

  return {
    verifyCaptchaMutation,
    logoutUserMutation,
    loginUserMutation,
    findAccountMutation,
    sendOtpEmailMutation,
    verifyOtpMutation,
  }
}
