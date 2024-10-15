import prisma from "@/prisma"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/auth";

export const GET = async ()=>{
    try {
        const data = await prisma.notices.findMany();
        
        
        return NextResponse.json(data);
      } catch (err) {
        console.error(err);
        return new NextResponse('Internal Server Error', { status: 500 });
      }
};

export const POST = async (req:NextRequest)=>{

  try {
  
    const session = await getServerSession(authOptions)
    if(!session || !session.user){
      return new NextResponse("Unauthorised Request" , {status:401})    
    }
    
    let notice = await req.json();
    delete notice.id
    if (!notice ) {
      return new NextResponse("Invalid Notice Data", { status: 400 });
    }

    // console.log(notice)

    if(notice.department===''){
      notice.department = 'toAll'
    }

    await prisma.notices.create({
      data:{
        ...notice
      }
    });
      return new NextResponse("Notice Added", { status: 200 });
  
    } catch (error) {
      console.log(error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
};