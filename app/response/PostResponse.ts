interface PostResponse{
    postId:number
    userId:string
    name:string
    image:string
    title:string
    content:string
    open:string
    viewCnt:number
    regDate:string
    modDate:string
    commentResponseDtoList:CommentResponse[];
}