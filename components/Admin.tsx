"use client"
import { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import { useSession } from 'next-auth/react';
import { typeNotice } from '@/types/notices';

export default function AdminPage() {

    const session = useSession();

    const getData = async () => {
        let res = await fetch("/api/data");
        const data = await res.json();
        setNotices([...data]);
        setDepartments(Array.from(new Set(data.map((dt: typeNotice) => dt.department))));
    };

    const [notices, setNotices] = useState<typeNotice[]>([]);
    const [departments, setDepartments] = useState<string[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

    useEffect(() => {
        getData();
    }, []);

    const openModal = (department: string) => {
        setSelectedDepartment(department);
    };

    const closeModal = () => {
        setSelectedDepartment(null);
    };

    return (
        <div className="p-10">
            <AdminNavbar />

            {/* Department Boxes */}
            <div className="grid grid-cols-3 gap-4">
                {departments.map((department) => (
                    <div
                        key={department}
                        className="bg-blue-600 text-white p-4 text-center cursor-pointer rounded-lg"
                        onClick={() => openModal(department)}
                    >
                        {department}
                    </div>
                ))}
            </div>

            {/* Modal for Selected Department */}
            {selectedDepartment && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-3/4 max-w-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500"
                            onClick={closeModal}
                        >
                            X
                        </button>
                        <h2 className="text-xl font-semibold mb-4">{selectedDepartment} Department Notices</h2>
                        <div className="overflow-y-auto h-64">
                            {notices
                                .filter(notice => notice.department === selectedDepartment)
                                .map((notice, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="text-lg font-bold text-blue-900 my-2">{notice.title}</div>
                                        <ul className="list-disc pl-4 text-gray-900">
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
            )}
        </div>
    );
}
