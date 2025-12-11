import RealisticGalaxyScene from '@/components/RealisticGalaxy';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Realistic Galaxy - WebGL Simulations',
  description: 'Explore a procedurally generated 3D galaxy with millions of stars',
};

export default function RealisticGalaxyPage() {
  return <RealisticGalaxyScene />;
}
