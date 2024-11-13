'use client'

import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

interface propState{
  fullScreen: boolean,
  setFullScreen: () => void
}

const AdminNavbar = ({fullScreen , setFullScreen}:propState) => {

  const router = useRouter();
  const session = useSession()

  
  const superAdmin = session.data?.user.superAdmin ;
  
  const handleAddAdmin = () => {
    // Navigate to the Add Admin page
    router.push('/admin/add-admin');
  }
 


  const logout = () => {
    signOut({
      redirect: true,
      callbackUrl: "/"
    })
  }


  return (
    <nav className=" border-b-4 mb-5 border-b-slate-800  p-4 flex justify-between items-center">
      <div className="text-slate-700 text-lg font-bold">Admin : {session.data?.user.email}</div>
      <div className="flex gap-4 w-1/3 " >
        <button className={`${fullScreen? "bg-green-500":"bg-gray-600"} p-2 px-3 rounded-md text-white `}  onClick={setFullScreen} >
          fullScreen : {fullScreen? "ON": "OFF"}
        </button>
        {/* super Admin */}
        {superAdmin==true && 
        <button
          onClick={handleAddAdmin}
          className="bg-blue-500 text-white px-4 py-2 rounded "
        >
          Add Admin
        </button>}

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default AdminNavbar;
