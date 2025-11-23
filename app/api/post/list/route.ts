import {NextResponse} from "next/server";


const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL;

export async function GET(req:Request){
    try{

        const requestUrl = new URL(req.url);
        const searchParams = requestUrl.searchParams.toString();

        const response = await fetch(HOME_URL + `/post/list?${searchParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const json = await response.json();

        return NextResponse.json(json, {status:response.status});
    }catch(error){
        console.error(error);
        return NextResponse.json({message:'home 서버 통신 실패'}, {status:500});
    }
}