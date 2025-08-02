import axios from "axios";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:7002", // API의 기본 URL
  timeout: 10000, // 요청 타임아웃 (밀리초)
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 전처리
// api.interceptors.request.use(
//   (config) => {
//     // 여기서 예를 들어, 토큰을 헤더에 추가할 수 있습니다.
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // 응답 전처리
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // 에러 처리
//     if (error.response) {
//       console.error("API Error:", error.response);
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
