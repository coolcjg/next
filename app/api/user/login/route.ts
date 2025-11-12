import {NextResponse} from "next/server";
import {apiClient} from "@/src/utils/apiClient";
import {HomeResponse} from "@/src/interfaces/common";

interface LoginResponse{
    userId:string;
    name:string;
    accessToken:string;
    refreshToken:string;
}

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL;

export async function POST(req:Request){
    try{
        const body = await req.json();

        console.log("요청 파라미터");
        console.log(body);

        const response = await apiClient<HomeResponse<LoginResponse>>(HOME_URL+'/v1/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
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