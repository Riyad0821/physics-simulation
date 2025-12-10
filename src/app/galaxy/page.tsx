import GalaxyScene from '@/components/Galaxy';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galaxy Explorer - WebGL Simulations',
  description: 'Explore the Milky Way galaxy with interactive 3D visualization',
};

export default function GalaxyPage() {
  return <GalaxyScene />;
}
