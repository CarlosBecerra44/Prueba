import { Inter } from "next/font/google";
import "./globals.css";
import { navbar as Inicio } from "@/components/navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AIONET",
  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
       <Inicio /> <br></br>{children}
        </body>
    </html>
  );
}
