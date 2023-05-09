import axios from 'axios'

const request = axios.create({
  timeout: 5 * 1000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2',
  },
})

request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  respone => {
    return respone
  },
  error => {
    return Promise.reject(error)
  },
)

export default request
