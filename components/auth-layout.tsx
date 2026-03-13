import Image from "next/image"
import Link from "next/link"
import imgTextura from "@/public/textura.svg"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen  bg-repeat-y bg-cover bg-center" style={{ backgroundImage: `url(${imgTextura.src})` }}>
    <Image src="/logo.png" alt="Cointreau" width={420} height={100} className="h-24 w-auto object-contain absolute top-4 left-4" />
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 ">
        <div className="w-full max-w-md bg-foreground p-6 rounded-lg shadow-md text-white">
          <div className="mb-8">
            <h1 className="heading-style-h1 uppercase font-medium text-white">{title}</h1>
            <p className="mt-1.5 text-size-medium text-white">{subtitle}</p>
          </div>
         
            {children}
          
        </div>
      </div>
    </div>
  )
}

