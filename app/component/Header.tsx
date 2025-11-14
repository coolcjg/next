'use client'

import LoginStatus from "@/app/component/LoginStatus";
import {useAuthStore} from "@/src/store/useAuthStore";
import {useRouter} from "next/navigation"; // 💡 shallow import

export default function Header(){

    const router = useRouter();

    const {userId, hasHydrated} = useAuthStore();

    return(
        <header style={{display:'flex', justifyContent:'space-between'}}>
            <div style={{cursor:'pointer'}} onClick={() => router.push('/post/list')}>게시판</div>
            {hasHydrated &&
                <div>
                    <LoginStatus isAuthenticated={!!userId} userName={userId}/>
                </div>
            }
        </header>
    )
}
