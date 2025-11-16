'use client'

import {useState} from "react";
import {Post} from "@/src/interfaces/post/Post";

export default function PostView(){

    const [post, setPost] = useState<Post>({'postId':0, 'title':'', content:'', userId:'', regDate:''});

    return(
        <div>
            <div>
                {post.title}
            </div>
            <div>
                {post.regDate}
            </div>
            <div>
                {post.userId}
            </div>
            <div>
                {post.content}
            </div>
        </div>



    )






}