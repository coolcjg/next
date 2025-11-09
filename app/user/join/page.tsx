'use client'

import {ChangeEvent, FormEvent, useState} from 'react';
import {HomeResopnse} from "@/src/interfaces/common";
import {apiClient} from "@/src/utils/apiClient";

interface JoinFormState{
    email:string;
    password:string;
}

export default function JoinPage(){

    const [formData, setFormData] = useState<JoinFormState>({email:'', password:''});
    const [message, setMessage] = useState<string>('');

    const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) =>({
            ...prev, [name]:value,
        }));
    };

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessage('가입중...');

        try {
            const response = await apiClient('/v1/user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data : HomeResopnse = await response.json();
                setMessage(`가입 성공! ${data.message}`);
                console.log('가입 성공 데이터:', data);

            } else {
                const errorData: HomeResopnse = await response.json();
                setMessage(`가입 실패: ${errorData.message}`);
                console.error('가입실패:', errorData);
            }

        }catch(error){
            setMessage('네트워크 오류가 발생하였습니다.');
            console.error('요청 중 오류 발생 : ' + error);
        }

    }

    return(
        <div>
            <h1>회원가입</h1>

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