import axios from 'axios'

const ROOT_URL = process.env.NEXT_PUBLIC_BACKEND_URL || false

const axiosClient = () => {
  return axios.create({
    baseURL: ROOT_URL,
    withCredentials: true,
  })
}

export default axiosClient
