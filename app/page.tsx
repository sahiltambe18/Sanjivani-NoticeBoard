
import List from '@/components/List';
import prisma from '../prisma';

export default async function Home() {
  const data = await prisma.notices.findMany({ 
    orderBy: {
      createdAt:'asc'
    }
  });

  console.log(data)

  
  return (
   <div class="h-[1024px] w-[1440px] flex flex-col items-center bg-white">
  <img class="w-[2338px] h-[1024px] object-cover">
  <div class="w-[1708px] h-[163px] bg-[#fbf5e7]"></div>
  <div class="w-[1708px] h-[146px] bg-[#fbf5e7]"></div>
  <span class="font-normal text-[110px] text-center text-black">SANJIVANI NOTICE BOARD</span>
  <svg class="w-[1342px] h-[668px] text-black"></svg>
  <span class="font-normal text-[30px] text-center text-black">Project By the Department of Electronics and Computer Engineering</span>
</div>
  );
}
