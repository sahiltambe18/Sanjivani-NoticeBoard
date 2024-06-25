import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation";
import Admin from "@/components/Admin";

async function  page() {
    const session = await getServerSession(authOptions);
    const callback = "/auth-callback?origin=admin"
    if(!session || !session.user){
      console.log("session not found")
        redirect(callback)
    }
    return ( 
    <Admin/>
  )
}

export default page