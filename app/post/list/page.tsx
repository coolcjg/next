import {apiClient} from "@/src/utils/apiClient";
import {HomeResponse} from "@/src/interfaces/common";

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


export default async function PostList(){

    try {
        const response = await apiClient(HOME_URL+'/post/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache:"no-store",
        });

        if (response.ok) {
            const data : HomeResponse<ListResponse> = await response.json();
            console.log(data);
        } else {

        }

    }catch(error){

        console.error('요청 중 오류 발생 : ' + error);
    }





    return(
        <div>
            <div>

                테이블 영역


            </div>

            <div>
                <button>등록</button>
            </div>
        </div>
    );
}