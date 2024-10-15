
import DepList from '@/components/DepList';
import prisma from '@/prisma';

export default async function Home({params}:{ params: { title: string}}) {
  const data = await prisma.notices.findMany({ 
    orderBy: {
      createdAt:'asc'
    },
    where:{
        department: params.title || 'toAll'
    }
  });

  if(data.length===0){
    return <h1>No notices found for this department.</h1>  
  }
  // console.log(data)

  

  // console.log(data)

  
  
  return (
    <div className='h-screen gap-10 items-center flex flex-col justify-start py-3 w-full' >
      <div className='text-[#2f2b26] flex w-screen items-center justify-center  h-40 font-semibold text-6xl bg-[#fbf5e7]'>
        SANJIVANI NOTICE BOARD
      </div>

      <div className='min-h-[40%] min-w-screen p-6 w-[60%] flex flex-col items-center gap-4 rounded-lg ' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} >
        <div className='items-center  flex flex-col font-semibold text-[#fffef8]'>
          
        </div>
        {/* <List data={data}  /> */}
        <DepList  depId={params.title} />
        
        
      </div>

    </div>

        )
      }