'use client'
import { typeNotice } from '@/types/notices';
import React, { useEffect, useRef, useState } from 'react'


export default function List() {
  const listRef = useRef<HTMLUListElement>(null);
  

  const getData = async () => {
    let res = await fetch("/api/data", {
      method: "GET"
    });
    let dt = await res.json();

    setData(dt);
  }

  const [data, setData] = useState<typeNotice[]>([
    {
      points: ["Please Wait..."],
      title: "Notices Are Loading ",
      createdAt: new Date(),
      id: "adcf",
    }
  ]);

  useEffect(() => {
    getData();

    const intervalId = setInterval(getData, 10000); // refetch 10sec

    return () => clearInterval(intervalId);
  }, []);

  
    
      useEffect(() => {
        const list = listRef.current;
        if (!list) return;
  
        let scrollAmount = data.length > 1 ? 1 : 0;
        const scrollInterval = setInterval(() => {
          if (list.scrollTop + list.clientHeight >= list.scrollHeight) {
            list.scrollTop = 0; // Reset to top
  
          } else {
            list.scrollTop += scrollAmount;
          }
        }, 50); // Adjust the speed 
  
        return () => clearInterval(scrollInterval);
      }, [data]);
  

  


  return (
    <ul ref={listRef} className='w-full hide-scrollbar  flex flex-col items-start text-[#fffef8] overflow-y-auto sm:pl-10' style={{ maxHeight: '100vh' }}>
      {data && data.map((notice, i) => (
        <div className='my-4' key={notice.id}>
          {notice.title && <><h2 className='text-xl'>
            <span className='font-light text-base'>{i + 1 + ".  "}</span>
            {notice.title}
          </h2>
            <ul className='list-disc pl-8'>
              {notice.points.length > 0 && notice.points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul></>}
          {notice.imageUrl && <img className='h-72 ml-2  rounded-lg border-2 border-gray-200' src={notice.imageUrl} alt={notice.title} />}
          {notice.imageUrl && <p className='text-transparent' >-</p>}
        </div>
      ))}
    
    </ul>
  )
}
