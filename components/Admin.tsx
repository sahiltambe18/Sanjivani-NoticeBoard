"use client"
import {  useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';

export default function AdminPage() {

    const getData = async () => {
        let res = await fetch("/api/data");
        const data = await res.json()
        console.log(data)
        setNotices([...data])
    }

    const [title, setTitle] = useState('');
    const [points, setPoints] = useState(['']);
    const [notices, setNotices] = useState([
        {
            id: 1,
            title: "something",
            points: ["sdc", "ddc", "dvvwdv"]
        }, {
            id: 2,
            title: "sdvsdv",
            points: ["dsvsdv", "dsvcdv"]
        }
    ]);


    useEffect(() => {
        getData()
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

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const newNotice = { id: Math.random(), title, points };
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
    };

    const handleDelete =  async (index: number) => {
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

    return (
        <div className="p-10">
            <AdminNavbar/>
            {/* <h1 className="text-3xl mb-5">Admin Page</h1> */}
            <form onSubmit={handleSubmit} className="mb-10">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1  w-3/6 h-10 border-2 border-gray-300 rounded-md shadow-sm"
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
                                className="mt-1 w-3/6 h-10   border border-gray-300 rounded-md shadow-sm"
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
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md"
                    >
                        Add Point
                    </button>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md"
                >
                    Add Notice
                </button>
            </form>

            <h2 className="text-2xl font-semibold mb-4">Notices</h2>
            <div className='bg-white p-6 rounded-lg overflow-y-auto'>
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
                        <div className='h-1 w-full mt-2 bg-black'></div>
                    </div>
                ))}
            </div>
        </div>
    );
}