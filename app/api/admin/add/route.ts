
import { NextRequest, NextResponse } from "next/server";

import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import prisma from "@/prisma";

export const POST = async (req: NextRequest )=>{
    
    const session = await getServerSession(authOptions)
    if(!session || !session.user) return new NextResponse("UNAUTHORISED", {status:401});

    try {
    let data = await req.json();
    console.log(data)

    data.password = await bcrypt.hash(data.password ,10);

    const res = await prisma.admins.create({
        data:{
            email:data.email,
            password:data.password
        }
    });

    if(!res) return new NextResponse("INTERNAL ERROR",{status:500});

    
    
    return NextResponse.json({data} , {status:200})
} catch (error) {       
    console.log(error)
    return new NextResponse( "INTERNAL ERROR" , {status:500})
}
}