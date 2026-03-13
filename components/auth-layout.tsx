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
    <div className="relative flex flex-col min-h-screen bg-repeat-y bg-cover bg-center" >
      <div className="absolute opacity-60 z-0 w-full h-full">
        <Image src={imgTextura} alt="Textura" className="w-full h-full object-cover" />
      </div>
      <Image src="/logo.png" alt="Cointreau" width={420} height={100} className="h-16 md:h-24 w-auto object-contain static md:absolute mt-4 ml-4 md:mt-8 md:ml-8" />
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 z-10">
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

