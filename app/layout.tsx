import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import './globals.css';
import { Room } from './_components/shared/Room';
import { Toaster } from '@/components/ui/toaster';
import ThemeProvider from './_components/providers/ThemeProvider';

const workSans = Work_Sans({
    subsets: ["latin"],
    variable: "--font-work-sans",
    weight: ["400", "600", "700"],
  });

export const metadata: Metadata = {
    title: 'Sketch Flow',
    description: 'Create design for your future website here',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={`${workSans.className} bg-gray-800`}>
                <ThemeProvider attribute='class'>
                    <Room>{children}</Room>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
