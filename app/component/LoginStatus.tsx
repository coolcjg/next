'use client';

import {useRouter} from 'next/navigation'
import {useAuthStore} from "@/src/store/useAuthStore"; // 💡 shallow import

interface LoginStatusProps {
    isAuthenticated?: boolean,
    userName?: string | null;
}

export default function LoginStatus({isAuthenticated, userName}: LoginStatusProps) {

    const router = useRouter();
    const {logout} = useAuthStore();

    const handleLoginClick = () => {
        router.push('/user/login');
    }

    const handleLogoutClick = () => {
        logout();
        router.push('/');
    }

    const handleJoinClick = () => {
        router.push('/user/join');
    }

    if(isAuthenticated){
        return (
            <div>
                <span>{userName} 환영합니다.</span>

                <button onClick={handleLogoutClick}>로그아웃</button>
            </div>
        )
    }

    return (
        <div>
            <span>로그인이 필요합니다</span>

            <button onClick={handleLoginClick}>로그인</button>
            <button onClick={handleJoinClick}>회원가입</button>
        </div>
    )

}

