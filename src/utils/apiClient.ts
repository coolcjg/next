import {tokenManager} from "@/src/utils/tokenManager";

const REFRESH_URL:string = '/v1/auth/refresh';

async function refreshAccessToken(): Promise<string | null>{
    const refreshToken = tokenManager.getRefreshToken();

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
            const data:{accessToken:string; refreshToken?:string} = await response.json();
            tokenManager.setToken(data.accessToken, data.refreshToken || refreshToken);
            return data.accessToken;
        }else{
            tokenManager.clearTokens();
            throw new Error('토큰 갱신 실패. 다시 로그인하세요.');

        }

    }catch(error){
        console.error('토큰 갱신중 오류 발생 : ', error);;
        tokenManager.clearTokens();
        return null;
    }
}

export async function apiClient<T>(
    url:string,
    options:RequestInit = {}
):Promise<Response>{
    const accessToken = tokenManager.getAccessToken();
    const headers = new Headers(options.headers);
    
    if(accessToken){
        headers.set('Authorization', `Bearer ${accessToken}`);
    }
    options.headers = headers;

    let response = await fetch(url, options);

    if(response.status === 401 && accessToken){
        console.log("Access Token 만료 감지. 갱신 시도...");

        const newAccessToken = await refreshAccessToken();

        if(newAccessToken){
            console.log("AccessToken 갱신 성공. 요청 재시도...");

            headers.set('Authorization', `Bearer ${accessToken}`);
            options.headers = headers;

            response = await fetch(url, options);
        }else{
            throw new Error('로그인이 만료되었습니다');
        }
    }

    return response;
}