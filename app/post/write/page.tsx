'use client'

import {ChangeEvent, FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/src/store/useAuthStore";
import {apiClientJSON} from "@/src/utils/apiClientJSON";
import {HomeResponse} from "@/src/interfaces/common";

export default function PostWrite(){

    const {accessToken, userId} = useAuthStore.getState();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [open, setOpen] = useState<string>('Y');

    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setTitle(value);
    }

    const handleContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setContent(value);
    }

    const handleOpen = (e: ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setOpen(value);
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("accessToken : " + accessToken);

        const payload = {
            userId:userId,
            title : title,
            content : content,
            open: open,
        }

        try{
            const res = await apiClientJSON('/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log('게시글 등록 API');

            const data:HomeResponse<PostResponse> = await res.json()

            console.log(data);
        }catch(err){
            console.log(err)
        }

    }

    const router = useRouter();

    return(
        <div>
            <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="title">제목</label>
                <input type="text" name="title" id="title" value={title} onChange={handleTitle}/>
            </div>
            <div>
                <label htmlFor="content">내용</label>
                <textarea name="content" id="content" value={content} onChange={handleContent}></textarea>
            </div>

            <div>
                <label htmlFor="open">공개여부</label>
                <select name="open" id="open" value={open} onChange={handleOpen}>
                    <option value="Y">공개</option>
                    <option value="N">비공개</option>
                </select>
            </div>

            <div>
                <button type="submit">등록</button>
                <button onClick={()=> router.push("/post/list")}>취소</button>
            </div>
            </form>
        </div>
    );
}