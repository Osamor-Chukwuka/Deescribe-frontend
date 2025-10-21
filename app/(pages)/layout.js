import "@/app/globals.css";
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
    title: "Deescribe",
    description: "web application for writing and reading articles",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Toaster position="bottom-right" reverseOrder={false} />
                {children}
            </body>
        </html>
    );
}