import { getServerSession } from "next-auth"
import { NextRequest } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"

export const GET = async (req:NextRequest) => {
    const data = await getServerSession(authOptions);

    console.log("auth")
    if(data?.user){
        return new Response( "success" , {status:200} )
    }
    return new Response("not authorised" , {status:401})
}