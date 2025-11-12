import {create} from 'zustand'
import {persist} from 'zustand/middleware';

interface AuthState{
    accessToken: string| null;
    refreshToken : string | null;
    userId : string | null;
    login:(accessToken:string, refreshToken:string, userId:string) => void;
    logout:() => void;

    hasHydrated:boolean;
    setHasHydrated:(state:boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken:null,
            refreshToken:null,
            userId:null,
            hasHydrated:false,

            setHasHydrated:(state:boolean) => set({hasHydrated:state}),

            login:(access, refresh, userId) => set({accessToken:access, refreshToken:refresh, userId:userId}),
            logout: () => set({accessToken:null, refreshToken:null, userId:null}),
        }),
        {
            name:"auth-storeage",
            onRehydrateStorage:() =>(state) =>{
                state?.setHasHydrated(true);
            }
        }
    )
);

