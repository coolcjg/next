import {NextResponse} from "next/server";

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL;

export async function POST(req:Request) {
    const body = await req.json();
    const headers = new Headers(req.headers);

    try{
        const res = await fetch(HOME_URL + '/v1/post',{
            method: "POST",
            headers:headers,
            body: JSON.stringify(body),
        })

        const json = await res.json();
        return NextResponse.json(json, {status:res.status});

    }catch(e){
        console.error(e);
        return NextResponse.json({message:'게시글 등록중 오류 발생'}, {status:500});
    }
 }

export async function DELETE(req:Request) {
    const body = await req.json();
    const headers = new Headers(req.headers);

    console.log("home으로 보내는 body");
    console.log(body);

    try{
        const res = await fetch(HOME_URL + '/v1/post',{
            method: "DELETE",
            headers:headers,
            body: JSON.stringify(body),
        })

        const json = await res.json();
        return NextResponse.json(json, {status:res.status});

    }catch(e){
        console.error(e);
        return NextResponse.json({message:'게시글 삭제중 오류 발생'}, {status:500});
    }
}