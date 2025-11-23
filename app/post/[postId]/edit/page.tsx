'use client'

import {Post} from "@/src/interfaces/post/Post";
import {FormEvent, useEffect, useState} from "react";
import {apiClientJSON} from "@/src/utils/apiClientJSON";
import {HomeResponse} from "@/src/interfaces/common";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/src/store/useAuthStore";

interface Props{
    params: {postId:string}
}

export default function EditPost({params}:Props){

    const {userId} = useAuthStore.getState();
    const {postId} = params;
    const [post, setPost] = useState<Post>({postId:0, title:'', content:'', userId:'', regDate:'', open:''})
    const router = useRouter();

    const fetchData = async () => {
        try{
            const response = await apiClientJSON('/api/post/'+ postId, {
                method:'GET',
                headers:{
                    'Content-Type': 'application/json'
                }
            })

            const result:HomeResponse<Post> = await response.json();

            if(result.code == 200){
                setPost(result.data);
            }else if(result.code == 404){
                alert('게시글이 없습니다');
                router.push('/post/list')
            }else{
                alert('에러 발생 : ' + result.message)
            }
        }catch(error){
            console.error('클라이언트 에러 : ', error);
        }
    }

    useEffect(()=>{
        const fetchInitData = async () => {
            await fetchData();
        }
        fetchInitData();
    }, [])


    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            userId:userId,
            title : post.title,
            content : post.content,
            open: post.open,
        }

        try{
            const res = await apiClientJSON('/api/post', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data:HomeResponse<PostResponse> = await res.json()

            console.log(data);
        }catch(err){
            console.log(err)
        }

    }

    const handlePost = (e:React.ChangeEvent<HTMLInputElement
                                                                                | HTMLTextAreaElement
                                                                                | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setPost(prev => ({...prev, [name]:value}));
    }


    return(
        <div>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="title">제목</label>
                    <input type="text" name="title" id="title" value={post.title} onChange={handlePost}/>
                </div>
                <div>
                    <label htmlFor="content">내용</label>
                    <textarea name="content" id="content" value={post.content} onChange={handlePost}></textarea>
                </div>

                <div>
                    <label htmlFor="open">공개여부</label>
                    <select name="open" id="open" value={post.open} onChange={handlePost}>
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