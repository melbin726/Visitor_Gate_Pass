import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  server:{
    host:true,
  }
})
=======
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173, // The port you want to use
  },
})
>>>>>>> 132a14813d1f4bbebd451bb45198d26ab573b6fb
