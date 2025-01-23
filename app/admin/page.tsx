import { getServerSession } from "next-auth"
import { authOptions } from "@/utils/auth";
import { redirect } from "next/navigation";
import Admin from "@/components/Admin";
import TimerControl from "../components/TimerControl";
import VideoStreamControl from "../components/VideoStreamControl";

async function page() {
    const session = await getServerSession(authOptions);
    const callback = "/auth-callback?origin=admin"
    if(!session || !session.user){
      console.log("session not found")
        redirect(callback)
    }
    // console.log("session is", session)
    return ( 
      <main className="bg-transparent">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
          {/* Header Section */}
          <center><div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-lg p-4 sm:p-6 border border-white/20">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sanjivani Display
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Smart Display Network System
            </p>
          </div></center>
          
          <div className="grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-2">
            {/* Admin Controls Card */}
            <div className="backdrop-blur-md bg-white/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group">
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100/80 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Admin Controls
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <Admin />
                </div>
              </div>
            </div>
            
            {/* Timer Settings Card */}
            <div className="backdrop-blur-md bg-white/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group">
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100/80 rounded-lg group-hover:bg-purple-100 transition-colors duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Other Settings
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <TimerControl />
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <VideoStreamControl />
              </div>
              </div>
            

            
          </div>
        </div>
        
      </main>
    )
}

export default page