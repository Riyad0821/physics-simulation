export const SHADER_CONFIG = {
  defines: {
    USE_LOGDEPTHBUF: '1',
    USE_LOGDEPTHBUF_EXT: '1',
    NUM_STARS: '2000000', // default, will be injected dynamically
    SPIRAL_ARMS: '2',
  },
  uniforms: {
    time: { value: 0 },
    pixelRatio: { value: 1 },
  }
};
