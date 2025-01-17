"use client";
import { FormEvent, useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import { handleUpload } from "@/utils/upload";
import { typeNotice } from "@/types/notices";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { Loader } from "lucide-react";

export default function AdminPage() {
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [points, setPoints] = useState([""]);
    const [admins, setAdmins] = useState([{ email: "xyz@gmail.com", id: "44" }]);
    const [notices, setNotices] = useState<typeNotice[]>([]);
    const [departments, setDepartments] = useState<string[]>([]);
    const [showAdmins, setShowAdmins] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [dropdownValue, setDropdownValue] = useState("");
    const [customValue, setCustomValue] = useState("");
    const [useCustomValue, setUseCustomValue] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);

    const getData = async () => {
        let res = await fetch("/api/data");
        const data = await res.json();
        setNotices([...data]);
        setDepartments(Array.from(new Set(data.map((dt: typeNotice) => dt.department))));
    };

    const getAdmins = async () => {
        let res = await fetch("/api/admin");
        const adminData = await res.json();
        setAdmins([...adminData]);
    };

    const getConfig = async () => {
        let res = await fetch("/api/config");
        const configData = await res.json();
        setFullScreen(configData[0].fullScreen);
    };

    const setFullScreenWrapper = ()=>{
        
        // console.log("new FullScreen ", fullScreen)
        setFullScreen( prev =>{
            const newState = !prev
            setTimeout( async ()=>{
                await ToggleFullScreen(newState)
            },500)
            return newState
        })
        
    }


    const ToggleFullScreen = async (fullScreen:boolean)=>{
        fetch('/api/config/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullScreen
            }),
        })
    }


    useEffect(() => {
        const handleFullscreenChange = () => {
            setFullScreen(!!document.fullscreenElement);
        };

        // Listen for fullscreen changes
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        // Cleanup listener on component unmount
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        getData();
        getAdmins();
        getConfig();
    }, []);



    const handleShowAdmin = () => {
        setShowAdmins((prev) => !prev);
    };

    const handleAddPoint = () => {
        setPoints([...points, ""]);
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
    const handleAction = async (formData: FormData) => {
        try {
            setError("")
            setLoading(true)
            console.log("here")
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
            setLoading(false)
            if (!res.ok) {
                toast("oops something went wrong!!",{
                    unstyled:false,
                    classNames: {
                        title:"text-red-300 font-semibold"
                    }
                } )
                return
            }
            toast.success("notice added successfully")

            setTitle('');
            setPoints(['']);
        } catch (error) {
            console.log(error)
            toast.error("Error while creating notice")
        }
    }

    const handleSubmit = (e:FormEvent)=>{
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)  ;
        handleAction(formData)
    };

    const handleDelete = async (index: number) => {
        const noticeToDelete = notices[index];
        const updatedNotices = notices.filter((_, i) => i !== index);
        setNotices(updatedNotices);
        const res = await fetch(`/api/delnotice/${noticeToDelete.id}`, { method: "DELETE" });
        if (!res.ok) {
            toast.error("Failed to delete notice");
            return;
        }
        toast.success("Notice deleted successfully");
    };

    const handleDeleteAdmin = async (index: number) => {
        const adminToBeDeleted = admins[index];
        const updatedAdmins = admins.filter((admin, i) => i !== index);
        setAdmins(updatedAdmins);
        const res = await fetch(`/api/admin/${adminToBeDeleted.id}`, { method: "DELETE" });
        if (!res.ok) {
            toast.error("Failed to delete Admin");
            return;
        }
        toast.success("Admin deleted successfully");
    };

    const handleFileChange = async (event: FormEvent<HTMLInputElement>) => {
        const file = (event.target as HTMLInputElement).files![0];

        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);

        const res = await fetch("/api/uploadimage", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            toast.error("Failed to upload image");
            return;
        }

        const image_url = await res.text();
        toast.success("Image uploaded successfully");

        // Update the notice with the uploaded image URL
        // For demonstration purposes, we're assuming the notice ID is '123'
        const notice_id = 123;
        const updatedNotice = notices.find((notice) => notice.id === notice_id);
        if (updatedNotice) {
            fetch(`/api/notice/${notice_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...updatedNotice, imageUrl: image_url }),
            });
        }
    };


    return (
        <div className="p-10">
            <AdminNavbar fullScreen={fullScreen} setFullScreen={setFullScreenWrapper} />

            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-10 bg-white p-6 rounded-md shadow-md">
                <p className="text-base text-red-600 text-center">{error}</p>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 px-2 w-full h-10 border-2 border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Points</label>
                    {points.map((point, index) => (
                        <div key={index} className="flex flex-col mb-2">
                            <input
                                type="text"
                                value={point}
                                onChange={(e) => handlePointChange(index, e.target.value)}
                                className="mt-1 px-2 w-full h-10 border border-gray-300 rounded-md shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemovePoint(index)}
                                className="mt-2 px-2 py-1 text-sm font-medium text-white bg-red-600 rounded-md self-start"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddPoint}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md w-full"
                    >
                        Add Point
                    </button>
                </div>

                <div className="my-3 font-semibold">
                    <label>Upload Image</label>
                    <input type="file" id="image" accept="image/*" name={"image"} className="w-full mt-1" />
                </div>
                <div className="my-3 font-semibold">
                    <label>Upload Video</label>
                    <input type="file" id="video" accept="video/*" name={"video"} className="w-full mt-1" />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Select or Add Custom Value</label>
                    <select
                        value={dropdownValue}
                        onChange={(e) => setDropdownValue(e.target.value)}
                        className="mt-1 px-2 w-full h-10 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select an option</option>
                        {/* Replace with your options */}
                    </select>

                    <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            checked={useCustomValue}
                            onChange={() => setUseCustomValue((prev) => !prev)}
                            className="mr-2"
                        />
                        <span>Or add custom value:</span>
                    </div>

                    {useCustomValue && (
                        <input
                            type="text"
                            value={customValue}
                            onChange={(e) => setCustomValue(e.target.value)}
                            className="mt-2 px-2 w-full h-10 border border-gray-300 rounded-md shadow-sm"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 flex gap-2 items-center shadow-xl hover:bg-green-700 disabled:bg-green-400 text-sm font-medium text-white bg-green-600 rounded-md w-full"
                >
                    {loading && <Loader className="animate-spin" />}
                    Add Notice
                </button>
            </form>

            {departments.map((department) => (
                <div key={department} className="w-full max-w-md mx-auto mb-6 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-2 text-center">{department} Department Notices</h2>
                    <div className="h-80 overflow-y-auto">
                        {notices
                            .filter((notice) => notice.department === department)
                            .map((notice, index) => (
                                <div key={index} className="mb-3">
                                    <div className="flex justify-between">
                                        <div className="text-xl font-bold text-blue-900">{notice.title}</div>
                                        <button
                                            className="font-semibold px-2 py-1 rounded-lg bg-red-600 text-white"
                                            onClick={() => handleDelete(index)}
                                        >
                                            Delete Notice
                                        </button>
                                    </div>
                                    <ul className="list-disc pl-4 text-gray-900">
                                        {notice.points.map((point, i) => (
                                            <li key={i}>{point}</li>
                                        ))}
                                    </ul>
                                    {notice.imageUrl && <img src={notice.imageUrl} alt="Notice" className="w-full h-auto mt-2" />}
                                    {notice.videoUrl && (
                                        <video controls className="w-full mt-2">
                                            <source src={notice.videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            ))}

            <button className="px-4 py-2 bg-blue-500 text-white rounded-md mb-5" onClick={handleShowAdmin}>
                Show Admins
            </button>

            {showAdmins && (
                <div className="bg-white w-full max-w-md mx-auto p-4 shadow rounded-lg">
                    <div className="grid grid-cols-1 gap-4">
                        {admins.map((admin, index) => (
                            <div key={admin.email} className="p-3 text-lg bg-gray-200 flex justify-between items-center">
                                <p className="font-semibold">{admin.email}</p>
                                <button
                                    className="font-semibold px-2 py-1 rounded-lg bg-red-600 text-white"
                                    onClick={() => handleDeleteAdmin(index)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Toaster
                position="bottom-right"
                toastOptions={{
                    unstyled: false,
                    classNames: {
                        title: "text-green-400 font-semibold",
                        actionButton: "bg-green-500",
                    },
                }}
            />
        </div>
    );
}