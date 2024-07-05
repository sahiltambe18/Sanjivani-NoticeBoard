"use client"
import { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import { useSession } from 'next-auth/react';
import { handleUpload } from '@/utils/upload';
import { typeNotice } from '@/types/notices';



export default function AdminPage() {

    const session = useSession()

    const getData = async () => {
        let res = await fetch("/api/data");
        const data = await res.json()
        // console.log(data)
        setNotices([...data])
    }

    const getAdmins = async () => {

        let res = await fetch('/api/admin');
        const adminData = await res.json();
        setAdmins(([...adminData]))
    }

    const [title, setTitle] = useState('');
    const [points, setPoints] = useState(['']);
    const [admins, setAdmins] = useState([{
        email: "xyz@gmail.com",
        id: "44"
    }]);
    const [notices, setNotices] = useState<typeNotice[]>([]);

    const [showAdmins, setShowAdmins] = useState<boolean>(false)
    const [showNotice, setShowNotice] = useState<boolean>(false)

    const handleShowAdmin = () => {
        setShowAdmins(prev => !prev)
    }
    const handleShowNotice = () => {
        setShowNotice(prev => !prev)
    }


    useEffect(() => {
        getData()
        getAdmins()
    }, [])




    const handleAddPoint = () => {
        setPoints([...points, '']);
    };

    const handleRemovePoint = (index: number) => {
        const newPoints = points.filter((_, i) => i !== index);
        setPoints(newPoints);
    };

    const handlePointChange = (index: number, value: string) => {
        const newPoints = [...points];
        newPoints[index] = value;
        setPoints(newPoints);
    };

   

    const handleDelete = async (index: number) => {
        const noticeToDelete = notices[index];
        const updatedNotices = notices.filter((_, i) => i !== index);
        setNotices(updatedNotices);

        const res = await fetch(`/api/delnotice/${noticeToDelete.id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            console.error("Failed to delete notice");
        }

    }

    const handleDeleteAdmin = async (index: number) => {
        const adminTobeDeleted = admins[index];
        const updatedAdmins = admins.filter((admin, i) => i !== index);
        setAdmins(updatedAdmins);

        const res = await fetch(`api/admin?id=${adminTobeDeleted.id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            console.error("Failed to delete notice");
        }
    }

    const handleAction = async (formData : FormData)=>{
        const data = await handleUpload(formData);
        formData.set("image","")
        
        let newNotice : typeNotice = { id: Math.random(), title, points };
        if(data.url){
            newNotice = {...newNotice , imageUrl : data.url}
        }
        setNotices([...notices, newNotice]);
        const res = await fetch("/api/data", {
            method: "POST",
            body: JSON.stringify(newNotice)
        })

        if (!res.ok) {
            return
        }

        window.location.reload()

        setTitle('');
        setPoints(['']);

        
    }

 
   



    return (
        <div className="p-10">
            <AdminNavbar />
            {/* <h1 className="text-3xl mb-5">Admin Page</h1> */}
            {/* <form action={handleAction}  onSubmit={handleSubmit} className="mb-10"> */}
            <form  action={handleAction}  className="mb-10">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 px-2 w-3/6 h-10 border-2 border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm  font-medium text-gray-700">Points</label>
                    {points.map((point, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={point}
                                onChange={(e) => handlePointChange(index, e.target.value)}
                                className="mt-1 px-2 w-3/6 h-10   border border-gray-300 rounded-md shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemovePoint(index)}
                                className="ml-2 px-2 py-1 text-sm font-medium text-white bg-red-600 rounded-md"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddPoint}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md"
                    >
                        Add Point
                    </button>
                </div>
                {/* image upload */}
                <div className='my-3 font-semibold'>
                   <label >Upload Image </label>
                    <input placeholder='Upload Image'  type="file" id='image' name={"image"}   accept='image/*' />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md"
                >
                    Add Notice
                </button>
            </form>

            {
                session.data?.user.superAdmin &&
                <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md mr-3" onClick={handleShowAdmin}>
                    {showAdmins ? "Hide" : "Show"} Admins
                </button>}

            {
                session.data?.user.superAdmin &&
                showAdmins &&
                <>
                    {/* <h2 className="text-2xl text-white underline font-semibold mb-4">Admins</h2> */}
                    <div className='bg-white h-80 p-6 my-3 rounded-lg overflow-y-auto'>
                        {admins.map((admin, index) => (
                            <div key={index} className="mb-3">
                                <div className='flex justify-between'>
                                    <h3 className="text-xl font-semibold">{admin.email}</h3>
                                    <button className='bg-red-500 text-xs p-2 rounded-md text-white font-semibold shadow-lg'
                                        onClick={() => { handleDeleteAdmin(index) }}>
                                        Delete
                                    </button>
                                </div>
                                <div className='h-1 w-full mt-2 bg-black'></div>
                            </div>
                        ))}
                    </div>
                </>
            }


            <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md" onClick={handleShowNotice}>
                {showNotice ? "Hide" : "Show"} Notices
            </button>

            {showNotice && <>
                {/* <h2 className="text-2xl font-semibold mb-4">Notices</h2> */}
                <div className='bg-white p-6 h-80 my-3 rounded-lg overflow-y-auto'>
                    {notices.map((notice, index) => (
                        <div key={index} className="mb-3">
                            <div className='flex justify-between'>
                                <h3 className="text-xl font-semibold">{notice.title}</h3>
                                <button className='bg-red-500 text-xs p-2 rounded-md text-white font-semibold shadow-lg' onClick={() => { handleDelete(index) }}>Delete</button>
                            </div>
                            <ul className="list-disc ml-6">
                                {notice.points.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                            {
                                notice.imageUrl
                            }
                            <div className='h-1 w-full mt-2 bg-black'></div>
                        </div>
                    ))}
                </div>
            </>}
        </div>
    );
}