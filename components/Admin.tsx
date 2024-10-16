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
        setNotices([...data])
        console.log(data)

        setDepartments(Array.from(new Set(data.map((dt: typeNotice) => dt.department))));
    }

    const getAdmins = async () => {
        let res = await fetch('/api/admin');
        const adminData = await res.json();
        setAdmins(([...adminData]))
    }

    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [points, setPoints] = useState(['']);
    const [admins, setAdmins] = useState([{
        email: "xyz@gmail.com",
        id: "44"
    }]);
    const [notices, setNotices] = useState<typeNotice[]>([]);
    const [departments, setDepartments] = useState<string[]>([]);

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

    const [dropdownValue, setDropdownValue] = useState('');
    const [customValue, setCustomValue] = useState('');
    const [useCustomValue, setUseCustomValue] = useState(false);

    const predefinedOptions = departments;

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

    const handleAction = async (formData: FormData) => {
        setError("")
        let newNotice: typeNotice = { 
            id: Math.random(),
             title, points , 
            department: useCustomValue ? customValue : dropdownValue
         };
        const fileI = formData.get("image") as unknown as File;
        const fileV = formData.get("video") as unknown as File;

        const maxSize = 90*1024*1024;

        if (fileI && fileI.size>0) {
            if(fileI.size>maxSize) {
                setError("max size of image is 90 Mb")
                return;
            }
            const data = await handleUpload(formData);
            newNotice = { ...newNotice, imageUrl: data.url }
            formData.set("image", "")
        } 
        if(fileV && fileV.size>0){
            if(fileV.size>maxSize) {
                setError("max size of video is 90 Mb")
                return;
            }
            const data = await handleUpload(formData,"video");
            newNotice = { ...newNotice, videoUrl: data.url }
            formData.set("video", "")

        }

        console.log(newNotice)
        
        setNotices([...notices, newNotice]);
        const res = await fetch("/api/data", {
            method: "POST",
            body: JSON.stringify(newNotice)
        })

        if (!res.ok) {
            return
        }

        setTitle('');
        setPoints(['']);
    }


    return (
        <div className="p-10">
            <AdminNavbar />

            <form action={handleAction} className="mb-10">
                <p className='text-base text-red-600'>{error}</p>
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
                    <label className="block text-sm font-medium text-gray-700">Points</label>
                    {points.map((point, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={point}
                                onChange={(e) => handlePointChange(index, e.target.value)}
                                className="mt-1 px-2 w-3/6 h-10 border border-gray-300 rounded-md shadow-sm"
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

                {/* Uploads */}
                <div className='my-3 font-semibold'>
                    <label>Upload Image</label>
                    <input type="file" id='image' accept='image/*' name={"image"} />
                </div>
                <div className='my-3 font-semibold'>
                    <label>Upload Video</label>
                    <input type="file" id='video' accept='video/*' name={"video"} />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Select or Add Custom Value</label>
                    <select
                        value={useCustomValue ? '' : dropdownValue}
                        onChange={(e) => {
                            setDropdownValue(e.target.value);
                            setUseCustomValue(false);
                        }}
                        className="mt-1 px-2 w-2/6 h-10 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select an option</option>
                        {predefinedOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>

                    <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            checked={useCustomValue}
                            onChange={() => setUseCustomValue(prev => !prev)}
                            className="mr-2"
                        />
                        <span>Or add custom value:</span>
                    </div>

                    {useCustomValue && (
                        <input
                            type="text"
                            value={customValue}
                            onChange={(e) => setCustomValue(e.target.value)}
                            className="mt-2 px-2 w-2/6 h-10 border border-gray-300 rounded-md shadow-sm"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md"
                >
                    Add Notice
                </button>
            </form>

            {departments.map((department) => (
    <div key={department} className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{department} Department Notices</h2>
        <div className='bg-white p-6 h-80 my-3 rounded-lg overflow-y-auto'>
            <div className='grid grid-cols-3 gap-6'> {/* Use grid layout here */}
                {notices
                    .filter(notice => notice.department === department)
                    .map((notice, index) => (
                        <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md"> {/* Optional: Add some styling for grid items */}
                            <div className='flex justify-between'>
                                <div className="text-3xl font-bold text-blue-900 my-2">{notice.title}</div>
                                <button
                                    className='font-semibold px-2 py-1 rounded-lg bg-red-600 text-white'
                                    onClick={() => handleDelete(index)}
                                >
                                    Delete Notiice
                                </button>
                            </div>
                            <ul className='list-disc pl-4 text-gray-900 text-lg'>
                                {notice.points.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                            {notice.imageUrl && <img src={notice.imageUrl} alt="Notice" className="w-full h-auto mt-2" />}
                            {notice.videoUrl && (
                                <video controls className="w-full h-auto mt-2">
                                    <source src={notice.videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    </div>
))}


            {/* Admins Section */}
            <button
                className='px-4 py-2 bg-blue-500 text-white rounded-md mb-5'
                onClick={handleShowAdmin}
            >Show Admins</button>

            {showAdmins && (
                <div className="bg-white p-4 shadow rounded-lg">
                    <div className='grid grid-cols-3 gap-4'>
                        {admins.map((admin, index) => (
                            <div key={admin.email} className='p-3 text-lg bg-gray-200'>
                                <p className='font-semibold'>{admin.email}</p>
                                <button
                                    className='font-semibold px-2 py-1 rounded-lg bg-red-600 text-white mt-2'
                                    onClick={() => handleDeleteAdmin(index)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
