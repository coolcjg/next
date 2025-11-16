'use client'

import {HomeResponse} from "@/src/interfaces/common";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {PostListResponse} from "@/src/interfaces/post/PostListResponse";

export default function PostList(){

    const [data, setData] = useState<PostListResponse | null>(null);
    const router = useRouter();

    useEffect(()=>{
        const fetchData = async () =>{

            try {
                const response = await fetch('/api/post/list', {
                    method: 'GET',
                });

                if (response.ok) {
                    const data : HomeResponse<PostListResponse> = await response.json();
                    console.log(data);
                    setData(data.data);
                } else {

                }

            }catch(error){

                console.error('요청 중 오류 발생 : ' + error);
            }
        };

        fetchData();

    }, []);

    return(
        <div>
            <div>
                {data && data.list.map(post =>
                    <div key = {post.postId}> Post {post.postId} </div>
                )}
            </div>

            <div>
                <button onClick={()=>router.push('/post/write')}>등록</button>
            </div>
        </div>
    );
}