import List from '@/components/List';
import TimerDisplay from "./components/TimerDisplay";
import VideoPlayer from './components/VideoPlayer';

export default function Home() {
  return (
    <div className='h-screen gap-10 items-center flex flex-col justify-start py-3 w-full'>
      <VideoPlayer />
      <div className='text-[#2f2b26] flex w-screen items-center justify-center h-40 font-semibold text-6xl bg-[#fbf5e7]'>
        SMART DISPLAY NETWORK SYSTEM
      </div>

      <div className='min-h-[40%] min-w-screen p-6 w-[95%] flex flex-col items-center gap-4 rounded-lg' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        <List />
        <TimerDisplay />
      </div>
    </div>
  );
}