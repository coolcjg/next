import {NextResponse} from "next/server";

interface LoginResponse{
    userId:string;
    name:string;
    accessToken:string;
    refreshToken:string;
}

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL;

export async function POST(req:Request){
    try{
        const headers = new Headers(req.headers);
        const payload = await req.json();

        const response = await fetch(HOME_URL+'/user/refreshToken', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });

        const json = await response.json();
        return NextResponse.json(json, {status:response.status});
    }catch(error){
        console.error(error);
        return NextResponse.json({message:'refreshToken 요청 에러'}, {status:500});
    }
}