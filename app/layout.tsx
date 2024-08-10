import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';
import { Room } from './_components/shared/Room';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';

const inter = Archivo({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Sketch Flow',
    description: 'Building application for design websites',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={inter.className}>
                <ThemeProvider attribute='class'>
                    <Room>{children}</Room>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
