"use client"
import { useSession,  signOut } from "next-auth/react";
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import styles from '../../../public/CSS/spinner.css';

export function Gente_y_cultura() {
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
    (<div
      className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Link href='/explorador_archivos'>
        <Button variant="outline" size="sm" className="fixed h-9 gap-2 right-4 top-10 bg-blue-500 text-white p-2 rounded-lg shadow-lg">
          <div className="h-3.5 w-3.5" />
          <FolderIcon className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Explorador de archivos</span>
        </Button>
      </Link>
      <div className="max-w-6xl w-full px-4">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold">Conócenos</h2>
          <p className="text-muted-foreground">
            Conoce a nuestro equipo de expertos que trabajan arduamente para brindar soluciones innovadoras a nuestros
            clientes.
          </p>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-square">
              <img
                src="/placeholder.svg"
                alt="Employee 1"
                width={400}
                height={400}
                className="object-cover w-full h-full"
                style={{ aspectRatio: "400/400", objectFit: "cover" }} />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">John Doe</h3>
              <p className="text-muted-foreground">Software Engineer</p>
              <p className="text-sm text-muted-foreground">
                John is a talented software engineer who specializes in building scalable and efficient web
                applications.
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-square">
              <img
                src="/placeholder.svg"
                alt="Employee 2"
                width={400}
                height={400}
                className="object-cover w-full h-full"
                style={{ aspectRatio: "400/400", objectFit: "cover" }} />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">Jane Smith</h3>
              <p className="text-muted-foreground">UX Designer</p>
              <p className="text-sm text-muted-foreground">
                Jane is a creative UX designer who crafts intuitive and user-friendly interfaces.
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-square">
              <img
                src="/placeholder.svg"
                alt="Employee 3"
                width={400}
                height={400}
                className="object-cover w-full h-full"
                style={{ aspectRatio: "400/400", objectFit: "cover" }} />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">Michael Johnson</h3>
              <p className="text-muted-foreground">Product Manager</p>
              <p className="text-sm text-muted-foreground">
                Michael is a strategic product manager who aligns business goals with user needs.
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-square">
              <img
                src="/placeholder.svg"
                alt="Employee 4"
                width={400}
                height={400}
                className="object-cover w-full h-full"
                style={{ aspectRatio: "400/400", objectFit: "cover" }} />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">Emily Davis</h3>
              <p className="text-muted-foreground">Marketing Specialist</p>
              <p className="text-sm text-muted-foreground">
                Emily is a talented marketing specialist who crafts engaging campaigns that drive results.
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-square">
              <img
                src="/placeholder.svg"
                alt="Employee 5"
                width={400}
                height={400}
                className="object-cover w-full h-full"
                style={{ aspectRatio: "400/400", objectFit: "cover" }} />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">David Lee</h3>
              <p className="text-muted-foreground">Data Analyst</p>
              <p className="text-sm text-muted-foreground">
                David is a skilled data analyst who transforms complex data into actionable insights.
              </p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-square">
              <img
                src="/placeholder.svg"
                alt="Employee 6"
                width={400}
                height={400}
                className="object-cover w-full h-full"
                style={{ aspectRatio: "400/400", objectFit: "cover" }} />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">Sarah Chen</h3>
              <p className="text-muted-foreground">Project Manager</p>
              <p className="text-sm text-muted-foreground">
                Sarah is an experienced project manager who ensures smooth execution and on-time delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>)
  );
}

function FolderIcon(props) {
  return(
    <svg
      className="h-4 w-4 text-gray-600"
      fill="none"
      stroke="black"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8l-6-4z"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}