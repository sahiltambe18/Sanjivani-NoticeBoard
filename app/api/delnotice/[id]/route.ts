
import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req:NextRequest , context:any)=>{
    const id = context.params.id
    const res = await prisma.notices.delete({
        where:{
            id:id
        }
    }) ;

    if(!res) return new NextResponse("Internal Server Error" , {status:500})

    return new NextResponse("success",{status:200})
}