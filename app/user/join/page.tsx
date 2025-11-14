'use client'

import {ChangeEvent, FormEvent, useState} from 'react';
import {HomeResponse} from "@/src/interfaces/common";
import {apiClientJSON} from "@/src/utils/apiClientJSON";
import CryptoJS from "crypto-js";
import { useRouter } from 'next/navigation';

const HOME_URL:string| undefined = process.env.NEXT_PUBLIC_HOME_URL;

interface UserIdCountResponse{
    count:number;
}

interface UserPostResponse{
    userId:string;
    name:string;
    image:string;
}

interface PasswordFormState{
    password:string,
    passwordConfirm:string

    validPassword:boolean,
    validPasswordConfirm:boolean
}


interface JoinFormState{
    userId:string;
    validUserId:boolean;

    name:string;
    validName:boolean;

    image:File | null;
}

export default function JoinPage(){

    const router = useRouter();
    const [formState, setFormState] = useState<JoinFormState>({userId:'', validUserId:false, name:'', validName:false, image:null});
    const [passwordData, setPasswordData] = useState<PasswordFormState>({password:'', passwordConfirm:'', validPassword:false, validPasswordConfirm:false});
    const [message, setMessage] = useState<string>('');

    const handleTextChange = (e:ChangeEvent<HTMLInputElement>) => {

        const {name, value} = e.target;

        if(/\s/.test(value)){
            return;
        }

        if(name == 'userId'){
            validUserId(value);
        }else if(name == 'name'){
            validName(value);
        }

        setFormState((prev) =>({
            ...prev, [name]:value,
        }));
    };

    const validName = (name:string) =>{
        setFormState((prev) => ({
            ...prev, validName:name.length > 0
        }))
    }

    const validUserId = async(userId:string) =>{

        const regex  = /^[a-z]+[a-z0-9]{3,19}$/g;
        const result:boolean = regex.test(userId);

        if(!result){
            setFormState((prev) => ({
                ...prev, validUserId:false
            }))
            return;
        }

        try {
            const response = await apiClientJSON(HOME_URL+ '/v1/user/'+userId+'/count',{
                method: 'GET',
            });

            const data : HomeResponse<UserIdCountResponse> = await response.json();
            const count:number = data.data.count;

            setFormState((prev) => ({
                ...prev, validUserId: (count == 0)
            }));

        }catch(error){
            console.log(error);
        }
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

    const validForm = ():boolean =>{

        //아이디 체크
        if(!formState.validUserId){
            alert('아이디가 적합하지 않습니다');
            return false;
        }

        //이름 체크
        if(!formState.validName){
            alert('이름이 적합하지 않습니다');
            return false;
        }

        //비밀번호 체크
        if(!passwordData.validPassword || !passwordData.validPasswordConfirm){
            alert('패스워드가 적합하지 않습니다');
            return false;
        }

        return true;
    }




    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessage('가입중...');

        if(!validForm()){
            return;
        }

        const formData = new FormData();
        formData.append('userId',formState.userId);
        formData.append('name',formState.name);
        formData.append('password',CryptoJS.SHA256(passwordData.password).toString(CryptoJS.enc.Hex));

        if(formState.image != null){
            formData.append('image', formState.image);
        };

        try {
            const response = await apiClientJSON(HOME_URL+'/v1/user', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data : HomeResponse<UserPostResponse> = await response.json();
                setMessage(`가입 성공! ${data.message}`);
                alert('회원 가입이 완료되었습니다. 로그인 페이지로 이동됩니다');
                router.push('/user/login');
            } else {
                const errorData: HomeResponse<UserPostResponse> = await response.json();
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
                <div style={{display:'flex'}}>
                <label htmlFor="userId">아이디:</label>
                <input type="text" id="userId" name="userId" value={formState.userId} onChange={handleTextChange}/>
                    <div>
                        {
                            formState.validUserId ? '적합한 아이디입니다' : '아이디가 적합하지 않거나 중복입니다.(아이디는 영문 소문자로 시작, 영문소문자 + 숫자 조합 4~20자리만 가능)'
                        }
                    </div>
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