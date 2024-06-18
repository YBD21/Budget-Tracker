import client from './axiosClient'

const baseUrl = '/auth-system'

export const loginUser = async (loginCredential) => {
  const response = await client().post(`${baseUrl}/login`, loginCredential)
  return response.data
}

export const verifyCaptcha = async (data) => {
  const response = await client().post(`${baseUrl}/verify-captcha`, data)
  return response.data
}

export const findAccount = async (data) => {
  const response = await client().post(`${baseUrl}/find-account`, data)
  return response.data
}

export const sendOtpEmail = async (data) => {
  const response = await client().post(`${baseUrl}/send-otp-email`, data)
  return response.data
}

export const verifyOtp = async (data) => {
  const response = await client().post(`${baseUrl}/verify-otp`, data)
  return response.data
}

export const resetPassword = async (data) => {
  const response = await client().post(`${baseUrl}/reset-password`, data)
  return response.data
}
