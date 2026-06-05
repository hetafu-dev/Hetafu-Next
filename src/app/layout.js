import { Geist, Geist_Mono, Share_Tech } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
import { CountryProvider } from "@/app/context/CountryContext";
import CartDrawer from "@/app/Components/Common/Cart/Drawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const shareTech = Share_Tech({
  variable: "--font-share-tech",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata = {
  title: "Hetafu - World's First Dental Nutrition Brand",
  description: "Hetafu is a dental nutrition brand that provides a unique solution to the problem of dental health",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${shareTech.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <CountryProvider>
          <CartProvider>
            <CartDrawer />
            {children}
          </CartProvider>
        </CountryProvider>
      </body>
    </html>
  );
}
