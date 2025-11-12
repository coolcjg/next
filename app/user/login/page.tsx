'use client'

import {ChangeEvent, FormEvent, useState} from 'react';
import CryptoJS from "crypto-js";
import {apiClient} from "@/src/utils/apiClient";
import {HomeResponse} from "@/src/interfaces/common";
import {useAuthStore} from '@/src/store/useAuthStore';
import {useRouter} from "next/navigation";

const HOME_URL:string| undefined = process.env.NEXT_PUBLIC_HOME_URL;

interface LoginFormState{
    userId:string;
    password:string;
}

interface DynamicObject {
    [key: string]: unknown; // 모든 문자열 키에 대해 unknown 타입의 값을 가질 수 있음
}

interface loginResponse{
    userId:string;
    name:string;
    accessToken:string;
    refreshToken:string;
}

export default function LoginPage(){

    const router = useRouter();
    const [formState, setFormState] = useState<LoginFormState>({userId:'', password:''});
    const [message, setMessage] = useState<string>('');
    const login = useAuthStore((state) => state.login);


    const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormState((prev) =>({
            ...prev, [name]:value,
        }));
    };

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessage('로그인 중...');

        const encryptedPassword:string = CryptoJS.SHA256(formState.password).toString(CryptoJS.enc.Hex);

        const payload = {
            userId : formState.userId,
            password : encryptedPassword
        }

        try {
            const response = await fetch('/v1/user/login', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (response.ok) {

                const data : HomeResponse<loginResponse> = await response.json();
                setMessage(`로그인 성공! ${data.message}`);
                console.log('로그인 성공 데이터:', data);

                login(data.data.accessToken, data.data.refreshToken, data.data.userId);
                router.push('/');

            } else {
                const errorData: HomeResponse<loginResponse> = await response.json();
                setMessage(`로그인 실패: ${errorData.message}`);
                console.error('로그인 실패:', errorData);
            }

        }catch(error){
            setMessage('네트워크 오류가 발생하였습니다.');
            console.error('요청 중 오류 발생 : ' + error);
        }

    }

    return(
        <div>
            <h1>로그인</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="userId">아이디:</label>
                <input type="text" id="userId" name="userId" value={formState.userId} onChange={handleInputChange}/>
                <br/>
                <label htmlFor="password">비밀번호:</label>
                <input type="password" id="password" name="password" value={formState.password} onChange={handleInputChange}/>
                <br/>
                <button type="submit">로그인</button>
            </form>
        </div>
    );
}