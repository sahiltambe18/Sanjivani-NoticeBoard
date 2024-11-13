'use client'
import { typeNotice } from '@/types/notices';
import React, { useEffect, useRef, useState } from 'react';

export default function List() {
  const listRef = useRef<HTMLUListElement>(null);

  const getData = async () => {
    let res = await fetch("/api/data", {
      method: "GET",
      next: {
        revalidate: 2000,
      }
    });
    let dt = await res.json();
    setData(dt.filter((d: typeNotice) => d.department === 'toAll'));
  };

  const getConfig = async () => {
    const response = await fetch('/api/config', {
      next: {
        revalidate: 2000
      }
    });
    const config = await response.json();
    setFullScreen(config[0].fullScreen);
  };

  const [fullScreen, setFullScreen] = useState(false);
  const [data, setData] = useState<typeNotice[]>([
    {
      points: ["Please Wait..."],
      title: "Notices Are Loading",
      createdAt: new Date(),
      id: "adcf",
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval =  setInterval( ()=>{
      getConfig();
      getData();

    },5000)
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (fullScreen) {
      const currentItem = data[currentIndex];

      let timer: string | number | NodeJS.Timeout | undefined;
      if (currentItem.videoUrl) {
        // For video: move to the next item after the video's duration
        const videoElement = document.getElementById(`video-${currentItem.id}`);
        if (videoElement) {
          videoElement.addEventListener('ended', handleNext);
        }
      } else {
        
        timer = setTimeout(handleNext, 5000); // Adjust time as needed for slideshow duration
      }

      return () => {
        if (timer) clearTimeout(timer);
      };
    } else {
      const list = listRef.current;
      if (!list) return;

      let scrollAmount = data.length > 1 ? 1 : 0;
      let isScrollingUp = false;

      const scrollInterval = setInterval(() => {
        if (list.scrollTop + list.clientHeight >= list.scrollHeight) {
          isScrollingUp = true;
          setTimeout(() => {
            list.scrollTop = 0;
            isScrollingUp = false;
          }, 2000);
        } else {
          if (!isScrollingUp) {
            list.scrollTop += scrollAmount;
          }
        }
      }, 50);

      return () => clearInterval(scrollInterval);
    }
  }, [fullScreen, currentIndex, data]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length); // Loop to the start after the last item
  };

  return (
    <ul ref={listRef} className='w-full hide-scrollbar flex flex-col items-center text-[#fffef8] overflow-y-auto sm:pl-10' style={{ maxHeight: '100vh' }}>
      {data && data.map((notice, i) => (
        <div key={notice.id} className={`my-6 flex flex-col gap-4 ${fullScreen && i !== currentIndex ? 'hidden' : ''}`}>
          {notice.title && (
            <>
              <h2 className='text-3xl font-bold'>
                <span className='font-light text-2xl'>{i + 1 + ".  "}</span>
                {notice.title}
              </h2>
              <ul className='list-disc pl-8'>
                {notice.points.length > 0 && notice.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </>
          )}
          {(notice.imageUrl || notice.videoUrl) && (
            <div className={`flex justify-center items-center ${fullScreen ? 'fixed inset-0.5 z-50' : ''}`}>
              {notice.imageUrl && (
                <img
                  className={`transition-all duration-500 ${fullScreen ? 'w-full h-full ' : 'w-full  max-w-3xl ml-2 rounded-lg border-2 border-gray-200 object-cover mx-auto'}`}
                  src={notice.imageUrl}
                  alt={notice.title}
                />
              )}
              {notice.videoUrl && (
                <video
                  id={`video-${notice.id}`}
                  className={`transition-all duration-500 ${fullScreen ? 'w-full h-full object-cover' : 'w-full max-w-3xl ml-2 rounded-lg border-2 border-gray-200 object-cover mx-auto'}`}
                  autoPlay
                  loop={!fullScreen}
                  muted
                  onEnded={fullScreen ? handleNext : undefined}
                >
                  <source src={notice.videoUrl} />
                </video>
              )}
            </div>
          )}
        </div>
      ))}
    </ul>
  );
}


// 0910