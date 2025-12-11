/**
 * Bloom Composer
 * Configurable Bloom effect wrapper using React-Three-Postprocessing
 */

import React from 'react';
import { Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export const BloomEffect = ({ intensity = 1.5, luminanceThreshold = 0.9 }: { intensity?: number, luminanceThreshold?: number }) => {
  return (
    <Bloom 
        intensity={intensity} 
        luminanceThreshold={luminanceThreshold} 
        luminanceSmoothing={0.025} 
        blendFunction={BlendFunction.SCREEN} 
    />
  );
};
