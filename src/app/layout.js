"use client";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });

import { Navbarv1 as Inicio } from "@/components/navbar";
import "./globals.css";

import NotificationBell from "@/components/Reminder/Components/notificationBell";
import { Suspense, useEffect, useState } from "react";
import { Menu } from "lucide-react";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const showNavbar = pathname !== "/login";
  const showNavbar3 = pathname !== "/";
  const showNavbar2 = pathname !== "/login/registro";

  const [isOpen, setIsOpen] = useState(true);
  const [navPosition, setNavPosition] = useState("relative");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    setIsOpen(screenWidth >= 768);
    setNavPosition(screenWidth >= 768 ? "relative" : "absolute");
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true} className={inter.className}>
        <SessionProvider>
          <div style={{ display: "flex" }}>
            {showNavbar && showNavbar3 && showNavbar2 && (
              <div className="flex">
                <div
                  style={{
                    position: navPosition,
                    top: "0",
                    left: "0",
                    height: "100vh",
                    backgroundColor: "#000000d6",
                    zIndex: 1,
                  }}
                  className={isOpen ? "md:block h-screen" : "hidden"}
                >
                  <Suspense>
                    <Inicio />
                  </Suspense>
                </div>
              </div>
            )}

            <div
              style={{
                padding: "1rem",
                overflowX: "auto",
              }}
              className="w-full"
            >
              {showNavbar && showNavbar3 && showNavbar2 && (
                <header className="flex flex-col items-end w-full gap-2">
                  <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={
                      isOpen ? "md:hidden cursor-pointer z-50" : "md:hidden"
                    }
                  >
                    <Menu
                      className="hover:text-slate-200"
                      style={{ color: "#333" }}
                    />
                  </div>
                  <NotificationBell />
                </header>
              )}
              <div className="mx-auto">{children}</div>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
