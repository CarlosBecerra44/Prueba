"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { useState } from "react"
import { useSession } from "next-auth/react";
import styles from '../../../public/CSS/spinner.css';

export function ExploradorArchivos() {
  const [openSection, setOpenSection] = useState(null)
  
  const {data: session,status}=useSession ();
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }
  if (status=="loading") {
    return <p>cargando...</p>;
    
  }
  if (!session || !session.user) {
    window.location.href = '/';
    return <p>No has iniciado sesión</p>;
  }

  return (
    (<div className="flex h-screen w-full">
      <div className="bg-background border-r w-64 p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <FolderIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-medium">File Explorer</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <nav className="space-y-1">
            <Link
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
              prefetch={false}>
              <HomeIcon className="w-4 h-4 text-muted-foreground" />
              <span>Home</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
              prefetch={false}>
              <FolderIcon className="w-4 h-4 text-muted-foreground" />
              <span>Documents</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
              prefetch={false}>
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <span>Images</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
              prefetch={false}>
              <VideoIcon className="w-4 h-4 text-muted-foreground" />
              <span>Videos</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
              prefetch={false}>
              <DownloadIcon className="w-4 h-4 text-muted-foreground" />
              <span>Downloads</span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <UploadIcon className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button variant="outline" size="sm">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Documents</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Project Files</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FilterIcon className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <ListOrderedIcon className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-background rounded-md shadow-sm overflow-hidden">
            <div className="h-32 bg-muted/20 flex items-center justify-center">
              <FileIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium truncate">Document.docx</h3>
              <p className="text-xs text-muted-foreground">2.3 MB</p>
            </div>
          </div>
          <div className="bg-background rounded-md shadow-sm overflow-hidden">
            <div className="h-32 bg-muted/20 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium truncate">Image.jpg</h3>
              <p className="text-xs text-muted-foreground">1.5 MB</p>
            </div>
          </div>
          <div className="bg-background rounded-md shadow-sm overflow-hidden">
            <div className="h-32 bg-muted/20 flex items-center justify-center">
              <VideoIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium truncate">Video.mp4</h3>
              <p className="text-xs text-muted-foreground">25.1 MB</p>
            </div>
          </div>
          <div className="bg-background rounded-md shadow-sm overflow-hidden">
            <div className="h-32 bg-muted/20 flex items-center justify-center">
              <FileIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium truncate">Report.pdf</h3>
              <p className="text-xs text-muted-foreground">4.7 MB</p>
            </div>
          </div>
          <div className="bg-background rounded-md shadow-sm overflow-hidden">
            <div className="h-32 bg-muted/20 flex items-center justify-center">
              <FileIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium truncate">Presentation.pptx</h3>
              <p className="text-xs text-muted-foreground">8.2 MB</p>
            </div>
          </div>
          <div className="bg-background rounded-md shadow-sm overflow-hidden">
            <div className="h-32 bg-muted/20 flex items-center justify-center">
              <FileSpreadsheetIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium truncate">Spreadsheet.xlsx</h3>
              <p className="text-xs text-muted-foreground">3.9 MB</p>
            </div>
          </div>
          <div className="bg-background rounded-md shadow-sm overflow-hidden">
            <div className="h-32 bg-muted/20 flex items-center justify-center">
              <FileIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium truncate">Notes.txt</h3>
              <p className="text-xs text-muted-foreground">0.5 MB</p>
            </div>
          </div>
          <div className="bg-background rounded-md shadow-sm overflow-hidden">
            <div className="h-32 bg-muted/20 flex items-center justify-center">
              <FileArchiveIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium truncate">Archive.zip</h3>
              <p className="text-xs text-muted-foreground">12.4 MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>)
  );
}

function DownloadIcon(props) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>)
  );
}


function FileArchiveIcon(props) {
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
      <path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v18" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <circle cx="10" cy="20" r="2" />
      <path d="M10 7V6" />
      <path d="M10 12v-1" />
      <path d="M10 18v-2" />
    </svg>)
  );
}


function FileIcon(props) {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>)
  );
}


function FileSpreadsheetIcon(props) {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M8 13h2" />
      <path d="M14 13h2" />
      <path d="M8 17h2" />
      <path d="M14 17h2" />
    </svg>)
  );
}


function FilterIcon(props) {
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>)
  );
}


function FolderIcon(props) {
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
      <path
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>)
  );
}


function HomeIcon(props) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>)
  );
}


function ImageIcon(props) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>)
  );
}


function ListOrderedIcon(props) {
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
      <line x1="10" x2="21" y1="6" y2="6" />
      <line x1="10" x2="21" y1="12" y2="12" />
      <line x1="10" x2="21" y1="18" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>)
  );
}


function UploadIcon(props) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>)
  );
}


function VideoIcon(props) {
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
      <path
        d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>)
  );
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}