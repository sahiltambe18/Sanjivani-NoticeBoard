
import DepList from '@/components/DepList';
import prisma from '@/prisma';

export default async function Home({params}:{ params: { title: string}}) {
  const data = await prisma.notices.findMany({ 
    orderBy: {
      createdAt:'asc'
    },
    where:{
        department: params.title
    }
  });

  if(data.length===0){
    return <h1>No notices found for this department.</h1>  // return a message if no notices found for the department.  else return the list of notices.  // replace the hardcoded department name with dynamic parameter.  // use the prisma client to fetch the data from the database.  // use the List component to render the notices.  // use the DepList component to render the department name.  // use the useSession hook to check if the user is authenticated.  // if not authenticated, redirect to the login page.  // if authenticated, display the admin dashboard.  // use the useRouter hook to get the route parameter (department name) and pass it to the Home component.  // use the NextLink component to navigate to the department page.  // use the useRouter hook to get the route parameter (department name) and pass it to the DepList component.  // use the useRouter hook to get the route parameter (department
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
          <h3>Sanjivani Digital Notice Board</h3>
          <div>
            <h1 className='text-6xl font-bold'>SANJIVANI SYNC</h1>
          </div>
        </div>
        {/* <List data={data}  /> */}
        <DepList  depId={params.title} />
        
        
      </div>

    </div>

        )
      }