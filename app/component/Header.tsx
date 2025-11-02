import LoginStatus from "@/app/component/LoginStatus";
import {getCookie} from "cookies-next";

export default function Header(){

    const userInfoCookie = getCookie('user_info');

    let userInfo = null;

    if(userInfoCookie && typeof userInfoCookie === 'string'){
        try{
            userInfo = JSON.parse(userInfoCookie);
        }catch(e){
            console.error('Failed to parse user info cookie:', e);
        }
    }

    const isAuthenticated:boolean = !!userInfo;


    return(
        <header>
            <LoginStatus isAuthenticated={isAuthenticated} userName={userInfo?.uerName || null}/>
        </header>
    )
}