import { CursorChatProps, CursorMode } from '@/app/_types/applicationTypes';
import CursorSVG from '@/public/assets/CursorSVG';
import React from 'react';

const CursorChat = ({
    cursor,
    cursorState,
    setCursorState,
    updateMyPresence,
}: CursorChatProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (cursorState.mode === CursorMode.Chat) {
            updateMyPresence({ message: e.target.value });
            setCursorState({
                ...cursorState,
                message: e.target.value,
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (cursorState.mode === CursorMode.Chat) {
            if (e.key === 'Enter') {
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: cursorState.message,
                    message: '',
                });
            } else if (e.key === 'Escape') {
                setCursorState({
                    mode: CursorMode.Hidden,
                });
            }
        }
    };

    return (
        <div
            className='absolute left-0 top-0'
            style={{
                transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
            }}
        >
            {cursorState.mode === CursorMode.Chat && (
                <>
                    <CursorSVG color='#000' />
                    <div
                        className='absolute left-2 top-5 rounded-[20px] bg-blue-500 px-4 py-2 text-sm leading-relaxed text-black'
                        onKeyUp={(e) => e.stopPropagation()}
                    >
                        {cursorState.previousMessage && (
                            <div>{cursorState.previousMessage}</div>
                        )}
                        <input
                            className='z-10 w-60 border-none bg-transparent text-black placeholder-blue-300 outline-none'
                            autoFocus={true}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder={
                                cursorState.previousMessage
                                    ? ''
                                    : 'Say something...'
                            }
                            value={cursorState.message || ''}
                            maxLength={50}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default CursorChat;