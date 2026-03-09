import type { Metadata, Viewport } from 'next'
import { Work_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const nimbusSans = localFont({
  src: '../public/fonts/nimbus-sans-condensed-l-black.otf',
  variable: '--font-heading',
  display: 'swap',
})


export const metadata: Metadata = {
  title: 'Cointreau - Los mejores bares de Mexico',
  description:
    'Descubre, visita y registra tu experiencia en los mejores bares de Mexico.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${workSans.variable} ${nimbusSans.variable} font-sans antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          closeButton
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--card-foreground)',
              border: '1px solid var(--border)',
              opacity: 0.7,
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
