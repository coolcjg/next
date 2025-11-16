'use client'

import {HomeResponse} from "@/src/interfaces/common";
import {FormEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {PostListResponse} from "@/src/interfaces/post/PostListResponse";
import {apiClientJSON} from "@/src/utils/apiClientJSON";
import '@/public/root.css'

export default function PostList(){

    const [data, setData] = useState<PostListResponse>({list:[], totalPage:1, totalCount:0, pageNumber:1, nextPage:'', prevPage:'', pageList:[], searchType:'', searchText:''});
    const router = useRouter();
    const [searchType, setSearchType] = useState<string>("title");
    const [searchText, setSearchText] = useState<string>("");
    const [page, setPage] = useState<string>("1");

    const[checkedItems, setCheckedItems] = useState<number[]>([]);
    const[checkAll, setCheckAll] = useState<boolean>(false);

    const fetchData = async () =>{

        const params = {
            searchType,
            searchText,
            page
        };

        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== "" && value !== undefined && value !== null)
        );

        const params2 = new URLSearchParams(filteredParams);

        try {
            const response = await apiClientJSON(`/api/post/list?${params2.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
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

    useEffect(()=>{

        const fetchInitialData = async () => {
            await fetchData();
        }

        fetchInitialData();
    }, []);


    const onSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchData();
    }

    const handleCheckItems = (item:number) => {
        setCheckedItems((prev) =>
            prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item]
        );
    }

    const handleCheckAllItems = (e:React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setCheckAll(checked);

        let allPostIds:number[]=[];
        if(data != null){
            allPostIds = data.list.flatMap((item) => item.postId);
        }

        setCheckedItems(checked ? allPostIds : [])
    }

    const deleteItem = async ()=>{
        console.log("delete");

        const payload = {
            postIds : checkedItems
        }

        console.log("payload");
        console.log(payload);

        try{
            const response = await apiClientJSON('/api/post', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })

            const data:HomeResponse<null> = await response.json();
            console.log("server data");
            console.log(data)

            if(data.code === 200){
                alert('삭제 성공');
                await fetchData();
            }else{
                alert('삭제 실패');
            }

        }catch(error){
            console.error(error);
        }
    }

    return(
        <div>

            <div>
                <button onClick={deleteItem}>삭제</button>
            </div>

            <div className="table-border">
                <table>
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="checkAll" checked={checkedItems.length === data.list.length} onChange={(e)=>handleCheckAllItems(e)}/></th>
                            <th>제목</th>
                            <th>내용</th>
                            <th>아이디</th>
                            <th>등록일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.list.map(post =>
                            <tr key={post.postId}>
                                <td><input type="checkbox" checked={checkedItems.includes(post.postId)} onChange={()=> handleCheckItems(post.postId)}/></td>
                                <td>{post.title}</td>
                                <td>{post.content}</td>
                                <td>{post.userId}</td>
                                <td>{post.regDate}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div>
                <form onSubmit={onSubmit}>
                    <select name="searchType" id="searchType" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                        <option value="title">제목</option>
                        <option value="content">내용</option>
                        <option value="userId">아이디</option>
                    </select>
                    <input type="text" name="searchText" id="searchText" value={searchText} onChange={(e) => setSearchText(e.target.value)} />

                    <button>검색</button>
                </form>
            </div>

            <div>
                <button onClick={()=>router.push('/post/write')}>등록</button>
            </div>
        </div>
    );
}