const ACCESS_TOKEN_KEY:string = 'accessToken';
const REFRESH_TOKEN_KEY:string = 'refreshToken';

export const tokenManager = {

    getAccessToken:():string|null=>{
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    getRefreshToken:():string|null => {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    setToken:(accessToken:string, refreshToken:string):void =>{
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    },

    clearTokens:():void => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
}