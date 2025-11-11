'use client'

import {ChangeEvent, FormEvent, useState} from 'react';
import {HomeResopnse} from "@/src/interfaces/common";
import {apiClient} from "@/src/utils/apiClient";
import CryptoJS from "crypto-js";
import { useRouter } from 'next/navigation';

const HOME_URL:string| undefined = process.env.NEXT_PUBLIC_HOME_URL;

interface PasswordFormState{
    password:string,
    passwordConfirm:string

    validPassword:boolean,
    validPasswordConfirm:boolean
}


interface JoinFormState{
    userId:string;
    name:string;
    password:string;
    image:File | null;
}

export default function JoinPage(){

    const router = useRouter();
    const [formState, setFormState] = useState<JoinFormState>({userId:'', name:'', password:'', image:null});
    const [passwordData, setPasswordData] = useState<PasswordFormState>({password:'', passwordConfirm:'', validPassword:false, validPasswordConfirm:false});
    const [message, setMessage] = useState<string>('');

    const handleTextChange = (e:ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormState((prev) =>({
            ...prev, [name]:value,
        }));
    };

    const validPassword = (password:string) => {

        const regex = /^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[`~!@#$%^&*\\(\\)\-_=+]).{8,20}$/g
        const result:boolean = regex.test(password) && (password.search(/\s/) === -1);

        setPasswordData((prev:PasswordFormState)=>
            ({
                ...prev, validPassword:result, validPasswordConfirm:password == passwordData.passwordConfirm
            })
        );
    }

    const validPasswordConfirm = (password:string) => {

        const result:boolean = passwordData.password == password;

        setPasswordData((prev:PasswordFormState)=>
            ({
                ...prev, validPasswordConfirm:result
            })
        );
    }

    const handlePasswordChange = (e:ChangeEvent<HTMLInputElement>) => {
        const {name, value}= e.target;

        setPasswordData((prev) =>({
            ...prev, [name]:value
        }));

        if(name == 'password'){
            validPassword(value);
        }

        if(name == 'passwordConfirm'){
            validPasswordConfirm(value);
        }

        if(passwordData.validPassword && passwordData.validPasswordConfirm){
            setFormState((prev) => ({...prev, password: CryptoJS.SHA256(passwordData.password).toString(CryptoJS.enc.Hex)}))
        }else{
            setFormState((prev)=>({...prev, password:''}));
        }
    }

    const handleFileChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const file= e.target.files ? e.target.files[0] : null;
        setFormState(prev => ({...prev, image:file}));
    }

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessage('가입중...');

        const formData = new FormData();
        formData.append('userId',formState.userId);
        formData.append('name',formState.name);
        formData.append('password',formState.password);

        if(formState.image != null){
            formData.append('image', formState.image);
        };

        try {
            const response = await apiClient(HOME_URL+'/v1/user', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data : HomeResopnse = await response.json();
                setMessage(`가입 성공! ${data.message}`);
                alert('회원 가입이 완료되었습니다. 로그인 페이지로 이동됩니다');
                router.push('/user/login');
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
                <div>
                <label htmlFor="userId">아이디:</label>
                <input type="text" id="userId" name="userId" value={formState.userId} onChange={handleTextChange}/>
                </div>

                <div>
                <label htmlFor="name">이름:</label>
                <input type="text" id="name" name="name" value={formState.name} onChange={handleTextChange}/>
                </div>


                <div>
                <label htmlFor="image">이미지:</label>
                <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange}/>
                </div>

                <div style={{display:'flex'}}>
                <label htmlFor="password">비밀번호:</label>
                <input type="password" id="password" name="password" value={passwordData.password} onChange={handlePasswordChange}/>
                <div>
                    {passwordData.validPassword ?
                        <div>입력 확인</div> :
                        <div>영문자, 숫자 특수문자(`~!@#$%^&*()-_=+) 조합 8~20자리가 필요합니다</div>
                    }
                </div>

                </div>

                <div style={{display:'flex'}}>
                    <label htmlFor="passwordConfirm">비밀번호확인:</label>
                    <input type="password" id="passwordConfirm" name="passwordConfirm" value={passwordData.passwordConfirm} onChange={handlePasswordChange}/>

                    <div>
                        {passwordData.validPasswordConfirm?
                            <div>입력 확인</div> :
                            <div>위에서 입력한 비밀번호를 한번 더 입력해주세요.</div>
                        }
                    </div>
                </div>

                <button type="submit">가입</button>
            </form>
        </div>
    );
}