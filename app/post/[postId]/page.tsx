import React from "react";
import PostView from "@/app/post/[postId]/PostView";

export default async function page({params}:{params:{postId:string}}){

    const {postId} = await params;

    return(
        <PostView postId={postId}/>
    );

}