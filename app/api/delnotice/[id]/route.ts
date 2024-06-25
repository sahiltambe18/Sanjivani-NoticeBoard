
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req:NextRequest , context:any)=>{
    console.log( context.params.id)
    return new NextResponse("success",{status:200})
}