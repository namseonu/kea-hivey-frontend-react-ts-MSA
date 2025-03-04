import axios from "axios";

/**
 * 공통으로 사용할 axios 인스턴스 생성
 */
const axiosApi = (options: []) => {

    return axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        ...options
    });

}

/**
 * JWT 토큰이 필요한 axios 인스턴스 생성
 */
const axiosAuthApi = (options: []) => {
    const jwtToken = localStorage.getItem('jwt-token') || '';

    return axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
            'X-ACCESS-TOKEN': `${jwtToken}`
        },
        ...options,
    });

}

export const instance = axiosApi([]);
export const authInstance = axiosAuthApi([]);
