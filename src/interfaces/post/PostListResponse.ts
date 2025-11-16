import {Post} from "@/src/interfaces/post/Post";
import {Property} from "csstype";
import Page = Property.Page;

export interface PostListResponse {
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