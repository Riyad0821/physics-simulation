import GalaxyScene from '@/components/galaxy/core/GalaxyScene';
import Navbar from '@/components/Navbar';

export default function RealisticGalaxyPage() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <Navbar />
      <GalaxyScene />
    </div>
  );
}
