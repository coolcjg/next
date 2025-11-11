export interface DynamicObject {
    [key: string]: unknown; // 모든 문자열 키에 대해 unknown 타입의 값을 가질 수 있음
}

export interface HomeResponse<T>{
    code:string;
    message:string;
    data:T;
}