// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css"; // ⬅️ AQUÍ
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "yet-another-react-lightbox/styles.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";
import Header from "@/widget/header/Header";
import Footer from "@/widget/footer/Footer";
import NextTopLoader from "nextjs-toploader";
import AppProviders from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    default: "Carpintería CILLAT",
    template: "%s",
  },
  description: "Carpintería CILLAT landing",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // suppressHydrationWarning solo evita el aviso de mismatch causado por
  // extensiones de navegador (ej. Dark Reader) que inyectan atributos en
  // <html> antes de que React hidrate. No oculta errores reales de
  // hidratación del propio contenido.
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>
          <NextTopLoader
            color="#F5C400"   // tu amarillo marca
            height={3}
            showSpinner={false}
          />
          <Header/>
          {children}
          <Footer/>
        </AppProviders>
      </body>
    </html>
  );
}
