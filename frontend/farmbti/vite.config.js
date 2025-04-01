import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as fs from "fs";
import * as path from "path";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   https: {
  //     key: fs.readFileSync(path.resolve(__dirname, "localhost-key.pem")),
  //     cert: fs.readFileSync(path.resolve(__dirname, "localhost.pem")),
  //   },
  // }
})
