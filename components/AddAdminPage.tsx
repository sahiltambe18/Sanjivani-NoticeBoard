'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const AddAdminPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const AdminSesssion =  useSession()

  if (!AdminSesssion.data?.user.superAdmin) {
    router.push("/admin")
  }

  // console.log(AdminSesssion)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();



    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    console.log("submitted")

    try {
      // Replace with your API call to add a new admin
      const response = await fetch('/api/admin/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const session = await response.json();
      if (response.ok) {

        console.log(session)
        // Redirect to Stripe checkout
        // window.location.href = session.link;
        // redirect(session.link)
        // redirect(session)
        // router.push(session.link)
        router.push('/admin')
      } else {
        setError(session.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.log(err)
      setError('An error occurred while adding the admin');
    }
  };

  return (
    <div className='flex justify-center h-screen p-10 pt-16 '>
    <div  style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} className=" text-slate-300 w-1/2 h-5/6 rounded-2xl flex flex-col items-center p-10">
      <h1 className="text-3xl mb-6">Add Admin</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 max-w-sm">
        <div className="mb-4">
          <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            disabled={password!==confirmPassword || email.length==0 || !AdminSesssion.data?.user.superAdmin}
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 disabled:bg-red-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {
              AdminSesssion.data?.user.superAdmin ?"ADD ADMIN" : "NOT SUPER ADMIN"
            }
            
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddAdminPage;
