'use client'

import {ChangeEvent, FormEvent, useState} from 'react';

interface LoginFormState{
    email:string;
    password:string;
}

interface DynamicObject {
    [key: string]: unknown; // 모든 문자열 키에 대해 unknown 타입의 값을 가질 수 있음
}

interface HomeResopnse{
    code:string;
    message:string;
    data:DynamicObject;
}

export default function LoginPage(){

    const [formData, setFormData] = useState<LoginFormState>({email:'', password:''});
    const [message, setMessage] = useState<string>('');

    const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) =>({
            ...prev, [name]:value,
        }));
    };

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessage('로그인 중...');

        try {
            const response = await fetch('/v1/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data : HomeResopnse = await response.json();
                setMessage(`로그인 성공! ${data.message}`);
                console.log('로그인 성공 데이터:', data);

            } else {
                const errorData: HomeResopnse = await response.json();
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
                <label htmlFor="email">이메일:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange}/>
                <br/>
                <label htmlFor="password">비밀번호:</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange}/>
                <br/>
                <button type="submit">로그인</button>
            </form>
        </div>
    );
}