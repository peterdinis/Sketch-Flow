'use client';

import { ReactNode } from 'react';
import { ClientSideSuspense } from '@liveblocks/react';
import { LiveMap } from '@liveblocks/client';
import { Loader2 } from 'lucide-react';
import { RoomProvider } from '@/liveblocks.config';

export function Room({ children }: { children: ReactNode }) {
    return (
        <RoomProvider
            id='my-room'
            initialPresence={{
                cursor: null,
                cursorColor: null,
                editingText: null,
            }}
            initialStorage={{ canvasObjects: new LiveMap() }}
        >
            <ClientSideSuspense
                fallback={<Loader2 className='h-8 w-8 animate-spin' />}
            >
                {() => children}
            </ClientSideSuspense>
        </RoomProvider>
    );
}
