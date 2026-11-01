import { defineConfig } from 'vite';

export default defineConfig({
  // ตั้งค่าให้ Vite มองหาไฟล์ index.html เป็นหลัก
  build: {
    outDir: 'dist',
  },
});
