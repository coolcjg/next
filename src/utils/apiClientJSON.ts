'use client'

import { useAuthStore } from "@/src/store/useAuthStore";
const HOME_URL:string|undefined = process.env.NEXT_PUBLIC_HOME_URL;
const REFRESH_URL:string =  HOME_URL + '/v1/auth/refresh';


async function refreshAccessToken(): Promise<string | null>{
    const { refreshToken, login} = useAuthStore.getState();
    //const refreshToken = tokenManager.getRefreshToken();

    if(!refreshToken){
        alert('Refresh token not provided');
        return null;
    }

    try{
        const response = await fetch(REFRESH_URL, {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',

                'Authorization' : `Bearer ${refreshToken}`,
            },
        });

        if(response.ok){
            const data:{accessToken:string; refreshToken:string, userId:string} = await response.json();

            login(data.accessToken, data.refreshToken, data.userId)
            //tokenManager.setToken(data.accessToken, data.refreshToken || refreshToken);

            return data.accessToken;
        }else{
            //tokenManager.clearTokens();
            throw new Error('토큰 갱신 실패. 다시 로그인하세요.');

        }

    }catch(error){
        console.error('토큰 갱신중 오류 발생 : ', error);

        //tokenManager.clearTokens();
        return null;
    }
}

export async function apiClientJSON<T>(
    url:string,
    options:RequestInit = {}
):Promise<Response>{
    const {method = "GET", headers = {}, body } = options;
    const {accessToken} = useAuthStore.getState();
    const finalHeaders = new Headers(headers);

    if(accessToken !== undefined && accessToken !== null){
        finalHeaders.append("Authorization", `Bearer ${accessToken}`);
    }

    let response = await fetch(url, {
        method,
        headers : finalHeaders,
        body:body
    });

    if(response.status === 401 && accessToken){
        console.log("Access Token 만료 감지. 갱신 시도...");

        const newAccessToken = await refreshAccessToken();

        if(newAccessToken){
            console.log("AccessToken 갱신 성공. 요청 재시도...");

            finalHeaders.append("Authorization", `Bearer ${newAccessToken}`);

            response = await fetch(url, {
                method,
                headers : finalHeaders,

            });
        }else{
            throw new Error('로그인이 만료되었습니다');
        }
    }

    return response;
}