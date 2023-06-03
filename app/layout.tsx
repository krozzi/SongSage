import './globals.css'
import { Poppins, Inter, Space_Grotesk } from 'next/font/google'
import Header from "../components/Header"

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: "swap",
  variable: '--font-poppins'
});
const space = Space_Grotesk({
  subsets: ['latin'],
  display: "swap",
  variable: '--font-space',
});


export const metadata = {
  title: 'SpotiPal | A quick and easy song recommender',
  description: 'Find personalized songs recommendations for spotify, youtube, and apple music in seconds. Expand your musical taste with SpotiPal.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    
    <html lang="en">
          
      <body className={`${space.variable} ${poppins.variable}`}>
        <Header />
        
        {children}
      </body>

    </html>
  )
}
