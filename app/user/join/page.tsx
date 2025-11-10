'use client'

import {ChangeEvent, FormEvent, useState} from 'react';
import {HomeResopnse} from "@/src/interfaces/common";
import {apiClient} from "@/src/utils/apiClient";

const HOME_URL:string| undefined = process.env.HOME_URL;


interface PasswordFormState{
    password:string,
    passwordConfirm:string

    validPassword:boolean,
    validPasswordConfirm:boolean
}


interface JoinFormState{
    email:string;
    name:string;
    password:string;
    image:File | null;
}

export default function JoinPage(){

    const [formData, setFormData] = useState<JoinFormState>({email:'', name:'', password:'', image:null});
    const [passwordData, setPasswordData] = useState<PasswordFormState>({password:'', passwordConfirm:'', validPassword:false, validPasswordConfirm:false});
    const [message, setMessage] = useState<string>('');

    const handleTextChange = (e:ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) =>({
            ...prev, [name]:value,
        }));
    };

    const handlePasswordChange = (e:ChangeEvent<HTMLInputElement>) => {
        const {name, value}= e.target;

        setPasswordData((prev) =>({
            ...prev, [name]:value
        }));

        if(passwordData.validPassword && passwordData.validPasswordConfirm){
            setFormData((prev) => ({...prev, password: CryptoJS.SHA256(passwordData.password).toString(CryptoJS.enc.Hex)}))
        }else{
            setFormData((prev)=>({...prev, password:''}));
        }
    }

    const handleFileChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const file= e.target.files ? e.target.files[0] : null;
        setFormData(prev => ({...prev, image:file}));
    }

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessage('가입중...');

        try {
            const response = await apiClient(HOME_URL+'/v1/user/', {
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
                <input type="email" id="email" name="email" value={formData.email} onChange={handleTextChange}/>
                <br/>

                <label htmlFor="name">이름:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleTextChange}/>
                <br/>

                <label htmlFor="image">이미지:</label>
                <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange}/>
                <br/>

                <label htmlFor="password">비밀번호:</label>
                <input type="password" id="password" name="password" value={passwordData.password} onChange={handlePasswordChange}/>
                <br/>

                <label htmlFor="passwordConfirm">비밀번호확인:</label>
                <input type="password" id="passwordConfirm" name="passwordConfirm" value={passwordData.passwordConfirm} onChange={handlePasswordChange}/>
                <br/>

                <button type="submit">가입</button>
            </form>
        </div>
    );
}