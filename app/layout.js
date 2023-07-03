'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import {
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button
} from '@chakra-ui/react'
import { Analytics } from '@vercel/analytics/react';

import { Providers } from "./providers";

import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Pregatire Licenta',
//   description: 'Pregatire Licenta 2023 Contabilitate si Informatica de Gestiune',
// }

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Container maxW='3xl'>
            <nav>
              <Menu>
                <MenuButton as={Button}>
                  Menu
                </MenuButton>
                <MenuList>
                  <MenuItem><Link className={pathname == "/" ? "active" : ""} href='/'>Home</Link></MenuItem>
                  <MenuItem><Link className={pathname == "/chestionar" ? "active" : ""} href='/'>Chestionar</Link></MenuItem>
                  <MenuItem><Link className={pathname == "/contabilitate-financiara" ? "active" : ""} href='/contabilitate-financiara'>Contabilitate Financiara</Link></MenuItem>
                  <MenuItem><Link className={pathname == "/baze-date" ? "active" : ""} href='/baze-date'>Baze de Date</Link></MenuItem>
                  <MenuItem><Link className={pathname == "/sisteme-gestiune" ? "active" : ""} href='/sisteme-gestiune'>Sisteme Informatice de Gestiune</Link></MenuItem>
                </MenuList>
              </Menu>
            </nav>
           {children}
          </Container>
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
