'use client'

import { useAuthStore } from "@/src/store/useAuthStore";
import {HomeResponse} from "@/src/interfaces/common";

async function refreshAccessToken(): Promise<string | null>{
    const { userId, refreshToken, login} = useAuthStore.getState();

    if(!refreshToken){
        console.error('Refresh token not provided');
        return null;
    }

    try{
        const payload = {'userId' : userId};

        const response = await fetch('/api/user/refreshToken', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${refreshToken}`,
            },
            body:JSON.stringify(payload)
        });

        const data:HomeResponse<UserLoginResponse> = await response.json();

        if(response.ok && data.code === 200){

            console.log("새로운 refreshToken 정보");
            console.log(data);

            login(data.data.accessToken, data.data.refreshToken, data.data.userId)

            return data.data.accessToken;
        }else if(response.status === 401){
            console.error("refreshToken만료");
        }
    }catch(error){
        console.error('토큰 갱신중 오류 발생 : ', error);
    }

    return null;
}


export async function apiClientJSON<T>(
    url:string,
    options:RequestInit = {}
):Promise<Response>{
    const {method = "GET", headers = {}, body } = options;
    const {accessToken, logout} = useAuthStore.getState();
    const finalHeaders = new Headers(headers);

    if(accessToken !== undefined && accessToken !== null){
        finalHeaders.append("Authorization", `Bearer ${accessToken}`);
    }

    let response = await fetch(url, {
        method,
        headers : finalHeaders,
        body:body
    });

    if(response.status === 401){
        console.log("Access Token 만료 감지. 갱신 시도...");

        const newAccessToken = await refreshAccessToken();

        if(newAccessToken != null){
            console.log("AccessToken 갱신 성공. 요청 재시도...");

            finalHeaders.delete("Authorization");
            finalHeaders.append("Authorization", `Bearer ${newAccessToken}`);

            response = await fetch(url, {
                method,
                headers : finalHeaders,
                body:body
            });

            return response;
        }else{
            logout();
            alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        }
    }

    return response;
}