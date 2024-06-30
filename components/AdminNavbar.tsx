'use client'

import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

const AdminNavbar = () => {

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
      <div className="text-slate-700 text-lg font-bold">Admin Dashboard</div>
      <div>
        {/* super Admin */}
        {superAdmin==true && 
        <button
          onClick={handleAddAdmin}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
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
