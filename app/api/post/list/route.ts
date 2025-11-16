import {NextResponse} from "next/server";


const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL;

export async function GET(req:Request){
    try{
        const {searchParams} = new URL(req.url);

        console.log("요청 파라미터");
        console.log(searchParams);

        const response = await fetch(HOME_URL+'/post/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const json = await response.json();

        console.log("home 결과");
        console.log(json);

        return NextResponse.json(json, {status:response.status});
    }catch(error){
        console.error(error);
        return NextResponse.json({message:'로그인 중 오류 발생'}, {status:500});
    }
}