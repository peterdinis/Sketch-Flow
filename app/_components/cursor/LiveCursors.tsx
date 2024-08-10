import React from 'react'
import Cursor from './Cursor';
import { LiveCursorProps } from '@/app/_types/applicationTypes';
import { COLORS } from '@/app/_constants';

const LiveCursors = ({ others }: LiveCursorProps) => {
    return others.map(({ connectionId, presence }) => {
        if (presence == null || !presence?.cursor) {
            return null;
        }

        return (
            <Cursor
                key={connectionId}
                color={COLORS[Number(connectionId) % COLORS.length]}
                x={presence.cursor.x}
                y={presence.cursor.y}
                message={presence.message}
            />
        )
    })
}

export default LiveCursors