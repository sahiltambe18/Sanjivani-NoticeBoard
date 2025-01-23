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
    <nav className="border-b-4 border-b-slate-800 bg-white shadow-md mb-5 p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <svg 
            xmlns="http://www.w3.org/dialog/2000" 
            className="h-8 w-8 text-slate-700" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <div className="text-slate-700 text-lg font-bold break-all">
            {session.data?.user.email}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          <button 
            className={`${
              fullScreen ? "bg-green-500 hover:bg-green-600" : "bg-gray-600 hover:bg-gray-700"
            } p-2 px-4 rounded-lg text-white transition-colors duration-200 flex items-center space-x-2`}
            onClick={setFullScreen}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" 
              />
            </svg>
            <span>{fullScreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </button>

          {superAdmin && (
            <button
              onClick={handleAddAdmin}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
                />
              </svg>
              <span>Add Admin</span>
            </button>
          )}

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar;
