import {NextResponse} from "next/server";
import {apiClient} from "@/src/utils/apiClient";
import {HomeResponse} from "@/src/interfaces/common";

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

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL;

export async function GET(req:Request){
    try{
        const {searchParams} = new URL(req.url);

        console.log("요청 파라미터");
        console.log(searchParams);

        const page:string = searchParams.get("page") || "1";

        const response = await apiClient<HomeResponse<ListResponse>>(HOME_URL+`/post/list?${searchParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const json = await response.json();

        console.log("home 결과");
        console.log(json);

        return NextResponse.json(json);
    }catch(error){
        console.error(error);
        return NextResponse.json({message:'로그인 중 오류 발생'}, {status:500});
    }
}