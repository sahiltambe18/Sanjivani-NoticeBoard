import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req:NextApiRequest , context:any)=>{
    console.log( context.params.id)
    return new NextResponse("success",{status:200})
}