'use client'

import { signIn } from "next-auth/react"
import  { useRouter } from "next/navigation"


export default function  page({origin}:{origin:string }) {
  

  const router = useRouter();

  fetch("/auth-callback")
  .then((data)=>{
    if(data.status==200){
      console.log("success")
      router.push(origin? `/${origin}`:'/admin')
    }
  })
  .catch( (err)=>{
    console.log(err)
  })
  .finally( () =>{
    console.log("err in auth log")
  })
  
  signIn("credentials",{
    redirect:true,
    callbackUrl:`${origin ? origin : '/admin'}`
  })
  
  
  
    
    return (
    <div className="p-10 flex text-3xl flex-col items-center  " >
        <h1>Auth-Callback page</h1>
        <p className="animate-pulse" >You will be redirected automatically. </p>
    </div>
  )
}
