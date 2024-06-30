import prisma from "@/prisma";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async ()=>{
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return new NextResponse("UNAUTHORISED", { status: 401 });
        }

        const data = await prisma.admins.findMany({
            select:{
                email:true,
                id:true,
            }
        });

        return NextResponse.json(data);
    } catch (error) {
        return new NextResponse(JSON.stringify(error) , { status:500});
    }
}

export const DELETE = async (req:NextRequest)=>{
    const params = new URL(req.url);
    const id = params.searchParams.get('id')|| ""

    try {

        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return new NextResponse("UNAUTHORISED", { status: 401 });
        }
        
        await prisma.admins.delete({
            where:{
                id:id
            }
        });

        return new NextResponse("Admin Erased",{status:200})
    } catch (error) {
        return new NextResponse("INTERNAL SERVER",{status:500}); 
    }
}