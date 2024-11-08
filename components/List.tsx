'use client'
import { typeNotice } from '@/types/notices';
import React, { useEffect, useRef, useState } from 'react';

export default function List() {
  const listRef = useRef<HTMLUListElement>(null);

  const getData = async () => {
    let res = await fetch("/api/data", {
      method: "GET"
    });
    let dt = await res.json();
    setData(dt.filter((d: typeNotice) => d.department === 'toAll'));
  };

  const [data, setData] = useState<typeNotice[]>([
    {
      points: ["Please Wait..."],
      title: "Notices Are Loading ",
      createdAt: new Date(),
      id: "adcf",
    }
  ]);

  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    getData();
    const intervalId = setInterval(getData, 10000); // Refetch every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const showNoticePopup = () => {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setCurrentNoticeIndex((prevIndex) => (prevIndex + 1) % data.length);
      }, 5000); // Show popup for 5 seconds
    };

    showNoticePopup();
    const popupInterval = setInterval(showNoticePopup, 7000); // Next popup every 7 seconds

    return () => clearInterval(popupInterval);
  }, [data]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let scrollAmount = 1; // Adjust speed if needed
    const scrollInterval = setInterval(() => {
      list.scrollLeft += scrollAmount;
      if (list.scrollLeft + list.clientWidth >= list.scrollWidth) {
        list.scrollLeft = 0; // Reset to start
      }
    }, 50);

    return () => clearInterval(scrollInterval);
  }, [data]);

  return (
    <div className='relative'>
      {/* Popup for the current notice */}
      {showPopup && (
        <div className='fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50'>
          <div className='bg-white text-black p-6 rounded-lg max-w-lg w-full'>
            <h2 className='text-3xl font-bold mb-4'>{data[currentNoticeIndex].title}</h2>
            <ul className='list-disc pl-5'>
              {data[currentNoticeIndex].points.map((point, idx) => (
                <li key={idx} className='mb-2'>{point}</li>
              ))}
            </ul>
            {data[currentNoticeIndex].imageUrl && (
              <img
                className='h-72 mt-4 rounded-lg border-2 border-gray-200'
                src={data[currentNoticeIndex].imageUrl}
                alt={data[currentNoticeIndex].title}
              />
            )}
            {data[currentNoticeIndex].videoUrl && (
              <video className='h-72 mt-4 rounded-lg border-2 border-gray-200' autoPlay loop muted>
                <source src={data[currentNoticeIndex].videoUrl} />
              </video>
            )}
          </div>
        </div>
      )}

      {/* Scrolling Notice List */}
      <ul ref={listRef} className='w-full flex gap-8 hide-scrollbar overflow-x-auto overflow-y-hidden whitespace-nowrap'>
        {data && data.map((notice, i) => (
          <div className='flex-shrink-0 w-1/3 my-6' key={notice.id}>
            <h2 className='text-2xl font-bold mb-2'>
              <span className='font-light'>{i + 1}. </span>{notice.title}
            </h2>
            <ul className='list-disc pl-4'>
              {notice.points.length > 0 && notice.points.map((point, idx) => (
                <li key={idx} className='text-white'>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </div>
  );
}
