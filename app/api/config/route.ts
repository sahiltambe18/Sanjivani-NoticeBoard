import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Prisma from '@/prisma'
export const POST = async (req:NextRequest)=>{
    const session = await getServerSession(authOptions);
    if(!session || !session.user) {
        return new NextResponse("UNAUTHORIZED",{status:401});
    }
    try {
        let data = await req.json();
        console.log(data);
        // if(!data.fullScreen) {
        //     return new NextResponse("BAD REQUEST",{status:400});
        // }

        const response = await Prisma.config.updateMany({
            where:{},
            data:{
                darkTheme: true,                
                fullScreen: data.fullScreen,
            }
          });
          
        console.log("response", response)

        return new NextResponse("SUCCESS",{status:200});

    } catch (error) {
        console.log(error)
    }
}

export const GET = async (req:NextRequest)=>{
    const response = await Prisma.config.findMany()
    return NextResponse.json(response);
}