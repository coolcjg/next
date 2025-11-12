'use client'

import {HomeResponse} from "@/src/interfaces/common";
import {useEffect, useState} from "react";

const HOME_URL:string| undefined = process.env.NEXT_PUBLIC_HOME_URL;

interface Post{
    postId:number
}

interface Page{
    pageNumber:number
    pageUrl:string
}

interface ListResponse {
    list:Post[]
    totalPage:number
    totalCount:number
    pageNumber:number
    nextPage:string
    prevPage:string
    pageList:Page[]
    searchType:string
    searchText:string
}

interface PostListRequest{
    searchType:string
    searchText:string
    pageNumber:number
    pageSize:number
}

export default function PostList(){

    const [data, setData] = useState<ListResponse | null>(null);

    useEffect(()=>{
        const fetchData = async () =>{

            try {
                const response = await fetch('/api/post/list', {
                    method: 'GET',
                });

                if (response.ok) {
                    const data : HomeResponse<ListResponse> = await response.json();
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
                <button>등록</button>
            </div>
        </div>
    );
}