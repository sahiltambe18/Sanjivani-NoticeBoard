import List from '@/components/List';
import prisma from '../prisma';

export default async function Home() {
  const data = await prisma.notices.findMany({ 
    orderBy: {
      createdAt:'asc'
    }
  });
  // console.log(data)
  
  return (
    <div className='h-screen gap-10 items-center flex flex-col justify-start py-12 w-full' >
      <div className='text-[#2f2b26] flex w-screen items-center justify-center  h-40 font-semibold text-6xl bg-[#fbf5e7]'>
        SANJIVANI NOTICE BOARD
      </div>
      <div className='min-h-[40%] min-w-screen p-6 w-[60%] flex flex-col items-center gap-9 rounded-lg ' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} >
        <div className='items-center  flex flex-col font-semibold text-[#fffef8]'>
          <h3>Sanjivani Digital Notice Board</h3>
          <div>
            <h1 className='text-6xl font-bold'>SANJIVANI SYNC</h1>
          </div>
        </div>
        <List data={data}  />
      </div>

    </div>

        )
      }