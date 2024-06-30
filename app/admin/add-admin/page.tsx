import AddAdminPage from "@/components/AddAdminPage";
import { authOptions } from "@/utils/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";


export default async  function page() {

    const session = await getServerSession(authOptions);
    if(!session || !session.user ){
        redirect("/auth-callback")
    }
    return (
    <AddAdminPage/>
  )

}
