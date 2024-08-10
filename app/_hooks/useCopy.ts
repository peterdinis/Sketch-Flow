'use client';

import { useCallback, useState } from 'react';
import { CopiedValue, CopyFn } from '../_types/hookTypes';
import { useToast } from '@/components/ui/use-toast';

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null);
    const { toast } = useToast();
    const copy: CopyFn = useCallback(async (text) => {
        if (!navigator?.clipboard) {
            console.warn('Clipboard not supported');
            return false;
        }

        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(text);
            toast({
                title: 'Copied',
                duration: 2000,
                className: 'bg-green-800 text-white font-bold',
            });
            return true;
        } catch (error) {
            toast({
                title: 'Failed to copy value',
                duration: 2000,
                className: 'bg-red-800 text-white font-bold',
            });
            setCopiedText(null);
            return false;
        }
    }, []);

    return [copiedText, copy];
}
