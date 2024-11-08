'use client'
import { typeNotice } from '@/types/notices';
import React, { useEffect, useRef, useState } from 'react';

export default function List() {
  const listRef = useRef<HTMLUListElement>(null);
  const [data, setData] = useState<typeNotice[]>([
    {
      points: ["Please Wait..."],
      title: "Notices Are Loading ",
      createdAt: new Date(),
      id: "adcf",
    }
  ]);
  const [popupNotice, setPopupNotice] = useState<typeNotice | null>(null);

  const getData = async () => {
    let res = await fetch("/api/data", {
      method: "GET"
    });
    let dt = await res.json();
    setData(dt.filter((d: typeNotice) => d.department === 'toAll'));
  };

  useEffect(() => {
    getData();
    const intervalId = setInterval(getData, 10000); // refetch 10sec
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let scrollAmount = data.length > 1 ? 1 : 0;
    let isScrollingUp = false;

    const scrollInterval = setInterval(() => {
      if (!popupNotice) {  // Only scroll when no popup is displayed
        if (list.scrollTop + list.clientHeight >= list.scrollHeight) {
          isScrollingUp = true;
          setTimeout(() => {
            list.scrollTop = 0; // Reset to top after a brief pause for smooth transition
            isScrollingUp = false;
          }, 2000); // 2-second delay before resetting
        } else {
          if (!isScrollingUp) {
            list.scrollTop += scrollAmount;
          }
        }
      }
    }, 50); // Adjust the speed

    return () => clearInterval(scrollInterval);
  }, [data, popupNotice]);

  // Handle popup display for images or videos
  useEffect(() => {
    let popupIndex = 0;

    const displayPopup = () => {
      if (data[popupIndex] && (data[popupIndex].imageUrl || data[popupIndex].videoUrl)) {
        setPopupNotice(data[popupIndex]);
        setTimeout(() => {
          setPopupNotice(null);
          popupIndex = (popupIndex + 1) % data.length;
          setTimeout(displayPopup, 1000); // Delay before showing the next popup
        }, 5000); // Show popup for 5 seconds
      } else {
        popupIndex = (popupIndex + 1) % data.length;
        setTimeout(displayPopup, 1000); // Delay before checking next item
      }
    };

    displayPopup();
  }, [data]);

  return (
    <>
      <ul ref={listRef} className='w-full hide-scrollbar flex flex-col items-start text-[#fffef8] overflow-y-auto sm:pl-10' style={{ maxHeight: '100vh' }}>
        {data && data.map((notice, i) => (
          <div className='my-6 flex flex-col gap-4' key={notice.id}>
            {notice.title && <>
              <h2 className='text-3xl font-bold'>
                <span className='font-light text-2xl'>{i + 1 + ".  "}</span>
                {notice.title}
              </h2>
              <ul className='list-disc pl-8'>
                {notice.points.length > 0 && notice.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </>}
            {notice.imageUrl && <img className='h-72 ml-2 rounded-lg border-2 border-gray-200' src={notice.imageUrl} alt={notice.title} />}
            {notice.videoUrl &&
              <video className='h-72 ml-2 rounded-lg border-2 border-gray-200' autoPlay loop muted>
                <source src={notice.videoUrl} />
              </video>}
          </div>
        ))}
      </ul>

      {/* Full-screen popup */}
      {popupNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          {popupNotice.imageUrl && <img className="h-auto w-full max-w-screen-lg" src={popupNotice.imageUrl} alt={popupNotice.title} />}
          {popupNotice.videoUrl && (
            <video className="h-auto w-full max-w-screen-lg" autoPlay muted>
              <source src={popupNotice.videoUrl} />
            </video>
          )}
        </div>
      )}
    </>
  );
}
