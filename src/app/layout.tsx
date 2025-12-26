import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { FloatingCartWishlist } from "@/components/FloatingCartWishlist";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "HJ Fashion USA | Premium Pakistani Women's Clothing",
  description: "Discover authentic Pakistani fashion in the USA. Premium Shalwar Kameez, Anarkali Suits, Lehengas and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <AuthProvider>
          <CartProvider>
            {children}
            <FloatingCartWishlist />
            <Toaster position="top-right" richColors />
          </CartProvider>
        </AuthProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
