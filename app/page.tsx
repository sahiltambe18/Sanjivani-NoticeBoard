
import prisma from '../prisma';

export default async function Home() {
  const data = await prisma.notices.findMany({ 
    orderBy: {
      createdAt:'asc'
    }
  });

  console.log(data)

  
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
        <ul className=' w-full flex flex-col items-start text-[#fffef8] overflow-y-auto  sm:pl-10'>
          
          {
            data && data.map( (notice , i) =>{
              return(
                <div key={notice.id}>
                  <h2 className=' text-xl'>
                    <span className='font-light text-base' >{i+1 + ".  "}</span>
                     { notice.title}</h2>
                  <ul className='list-disc pl-8'>
                    {
                      notice.points.length > 0 && notice.points.map( ( point , idx) =>{
                        return (
                          <li key={idx} >{point}</li>
                        )
                      })
                    }
                  </ul>
                </div>
              )
            })
          }
        </ul>
      </div>

    </div>
  );
}
