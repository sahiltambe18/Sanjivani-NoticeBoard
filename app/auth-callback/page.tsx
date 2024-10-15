'use client'

import { useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"



export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const response = await fetch("/auth-callback");
        if (response.status === 200) {
          console.log("success");
          router.push('/admin');
        }
      } catch (err) {
        console.log(err);
      } finally {
        console.log("err in auth log");
      }
    };

    handleAuthCallback();

    signIn("credentials", {
      redirect: true,
      callbackUrl: '/admin'
    });
  }, [router]);

  return (
    <div className="p-10 flex text-3xl flex-col items-center">
      <h1>Auth-Callback page</h1>
      <p className="animate-pulse">You will be redirected automatically.</p>
    </div>
  );
}
