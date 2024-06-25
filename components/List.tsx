'use client'
import React, { useEffect, useRef } from 'react'

interface dataProps {
  points: string[],
  title: string,
  createdAt: Date,
  id: string
}

export default function List({ data }: { data: dataProps[] }) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let scrollAmount = 1;
    const scrollInterval = setInterval(() => {
      if (list.scrollTop + list.clientHeight >= list.scrollHeight) {
        list.scrollTop = 0; // Reset to top
      } else {
        list.scrollTop += scrollAmount;
      }
    }, 50); // Adjust the speed as necessary

    return () => clearInterval(scrollInterval);
  }, [data]);

  return (
    <ul ref={listRef} className='w-full flex flex-col items-start text-[#fffef8] overflow-y-auto sm:pl-10' style={{ maxHeight: '60vh' }}>
      {data && data.map((notice, i) => (
        <div key={notice.id}>
          <h2 className='text-xl'>
            <span className='font-light text-base'>{i + 1 + ".  "}</span>
            {notice.title}
          </h2>
          <ul className='list-disc pl-8'>
            {notice.points.length > 0 && notice.points.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </ul>
  )
}
