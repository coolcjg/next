'use client'

import LoginStatus from "@/app/component/LoginStatus";
import {useAuthStore} from "@/src/store/useAuthStore"; // 💡 shallow import

export default function Header(){

    const {userId, hasHydrated} = useAuthStore();

    if(!hasHydrated){
        return (
            <header>
                로딩중
            </header>
        )
    }

    return(
        <header style={{display:'flex', justifyContent:'space-between'}}>
            <div>게시판</div>
            <div>
            <LoginStatus isAuthenticated={!!userId} userName={userId}/>
            </div>
        </header>
    )
}
