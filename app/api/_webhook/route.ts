import { NextRequest, NextResponse } from "next/server";
// import { buffer } from "stream/consumers";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET!)

export const config = {
    api: {
      bodyParser: false,
    },
  };



  async function buffer(readable: ReadableStream<Uint8Array> | null): Promise<Buffer> {
    if (!readable) {
      throw new Error('Readable stream is null');
    }
  
    const reader = readable.getReader();
    const chunks: Uint8Array[] = [];
    let done, value;
  
    while (({ done, value } = await reader.read()) && !done) {
      if (value) {
        chunks.push(value);
      }
    }
  
    return Buffer.concat(chunks);
  }

export const POST = async (req:NextRequest)=>{

    const paylod = await req.json();

    // console.log(req)

    const sig = req.headers.get('stripe-signature');

    let event;

    // console.log(sig , '/n' , process.env.)

  try {

    // const buf = await buffer(req.body as ReadableStream<Uint8Array>);
    event = stripe.webhooks.constructEvent( paylod, sig!, process.env.ENDPOINTSECRET!);
 
    } catch (err) {
        console.log(err)
        const res = new NextResponse("error",{status:400})
        return res

    }

    console.log('Event received:', event);


    return new NextResponse("Test",{status:200})
    // try {
    //     const signature = req.headers['stripe-signature'] as string
    // } catch (error) {
        
    // }

};