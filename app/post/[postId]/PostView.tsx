'use client'

import {Post} from "@/src/interfaces/post/Post";
import {HomeResponse} from "@/src/interfaces/common";
import React, {useEffect, useState} from "react";
import {apiClientJSON} from "@/src/utils/apiClientJSON";
import {useRouter} from "next/navigation";

export default function PostView( {postId}: {postId:string}) {

    const [post, setPost] = useState<Post>();
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

    const listHandler = () =>{
        router.push('/post/list');
    }

    if(post){
        return(
            <>
                <div>
                    <h1>제목 : {post.title}</h1>
                    <p>글쓴이 : {post.userId}</p>
                    <p>글번호 : {post.postId}</p>
                    <p>등록일 : {post.regDate}</p>
                    <p>내용 : {post.content}</p>
                </div>
                <div>
                    <button onClick={() => listHandler()}>목록</button>
                    <button>수정</button>
                    <button>삭제</button>
                </div>
            </>
        )
    }

}