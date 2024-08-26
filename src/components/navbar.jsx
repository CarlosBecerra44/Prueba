"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbarv1() {
  const [openSection, setOpenSection] = useState(null)
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }
  return (
    (<div className="flex flex-col w-64 min-h-screen bg-gray-800 text-white">
      <div
        className="flex items-center justify-between h-16 border-b border-gray-700 px-4">
        <div style={{ color: "white" }} className="flex items-center">
          <img
            src="/placeholder.svg"
            alt="Logo"
            className="h-8"
            width="32"
            height="32"
            style={{ aspectRatio: "32/32", objectFit: "cover" }} />
          <span className="ml-2 font-medium">John Doe</span>
        </div>
      </div>
      <div className="p-4">
        <div className="relative mb-4">
          <SearchIcon style={{ color: "black" }} className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search"
            className="w-full pl-12 pr-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400" />
        </div>
        <nav className="space-y-2">
          <div
            className="text-gray-400 cursor-pointer"
            onClick={() => toggleSection("fundamentals")}
            style={{ color: "white" }}>
            Fundamentals
            {openSection === "fundamentals" ? (
              <div className="h-5 w-5 float-right" />
            ) : (
              <div className="h-5 w-5 float-right" />
            )}
          </div>
          {openSection === "fundamentals" && (
            <div style={{ color: "white" }} className="pl-4 space-y-2">
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Brand Appearance
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Basics
              </Link>
            </div>
          )}
          <div
            className="text-gray-400 cursor-pointer"
            onClick={() => toggleSection("user-interface")}
            style={{ color: "white" }}>
            User Interface
            {openSection === "user-interface" ? (
              <div className="h-5 w-5 float-right" />
            ) : (
              <div className="h-5 w-5 float-right" />
            )}
          </div>
          {openSection === "user-interface" && (
            <div style={{ color: "white" }} className="pl-4 space-y-2">
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                UI Introduction
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                UX Paradigms
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Responsive UI
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Form Tool
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Components
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Icon Library
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                UI Animation
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md bg-gray-700"
                prefetch={false}>
                Response Effect
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Functional Animation
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Transitions
              </Link>
              <Link
                href="#"
                className="block py-2 px-4 rounded-md hover:bg-gray-700"
                prefetch={false}>
                Browser Support
              </Link>
            </div>
          )}
        </nav>
      </div>
      <div className="mt-auto border-t border-gray-700 p-4">
        <Link href="/" className="underline">
          <Button style={{ color: "black" }} variant="outline" size="sm" className="w-full">
            <LogOutIcon className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </Link>
      </div>
    </div>)
  );
}

function LogOutIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>)
  );
}


function SearchIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>)
  );
}
