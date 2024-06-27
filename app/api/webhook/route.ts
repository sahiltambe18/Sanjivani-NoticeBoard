import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET!)

export const POST = async (req:NextRequest)=>{

    return new NextResponse("Test",{status:200})
    // try {
    //     const signature = req.headers['stripe-signature'] as string
    // } catch (error) {
        
    // }

}