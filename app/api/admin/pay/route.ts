
import { NextRequest, NextResponse } from "next/server";

import bcrypt from 'bcryptjs';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET!)

export const POST = async (req: NextRequest , res:NextResponse)=>{
    try {
    let data = await req.json();
    console.log(data)

    data.password = await bcrypt.hash(data.password ,10);

    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        mode:"payment",
        success_url:`http://localhost:3000/admin`,
        cancel_url:`https://localhost:3000/`,
        line_items:[
            {
                quantity:1,
                price_data:{
                    currency:'inr',
                    product_data:{
                        name:"Admin Account",
                    },
                    unit_amount:500
                }
            }
        ],
        metadata:data
    });
    console.log(session)
    return NextResponse.json({link:session.url} , {status:200})
} catch (error) {       
    console.log(error)
    return new NextResponse( "INTERNAL ERROR" , {status:500})
}
}