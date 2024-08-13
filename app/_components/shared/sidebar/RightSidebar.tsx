import React, { useRef } from 'react';
import { modifyShape } from '@/lib/shapes';
import { RightSidebarProps } from '@/app/_types/applicationTypes';
import Dimensions from '../../settings/Dimensions';
import Color from '../../settings/Color';
import Text from '../../settings/Text';
import Export from '../../settings/Export';

const RightSidebar = ({
    elementAttributes,
    setElementAttributes,
    fabricRef,
    activeObjectRef,
    isEditingRef,
    syncShapeInStorage,
}: RightSidebarProps) => {
    const colorInputRef = useRef(null);
    const strokeInputRef = useRef(null);

    const handleInputChange = (property: string, value: string) => {
        if (!isEditingRef.current) isEditingRef.current = true;

        setElementAttributes((prev) => ({ ...prev, [property]: value }));

        modifyShape({
            canvas: fabricRef.current as fabric.Canvas,
            property,
            value,
            activeObjectRef,
            syncShapeInStorage,
        });
    };
    return (
        <section className='broder-t border-primary-grey-200 bg-primary-black text-primary-grey-300 sticky right-0 flex h-full min-w-[227px] select-none flex-col max-sm:hidden'>
            <h3 className='px-5 pt-4 text-xs uppercase'>Design</h3>
            <span className='text-primary-grey-300 border-primary-grey-200 mt-3 border-b px-5 pb-4 text-xs'>
                Make Changes to canvas as you like
            </span>

            <Dimensions
                width={elementAttributes.width}
                height={elementAttributes.height}
                handleInputChange={handleInputChange}
                isEditingRef={isEditingRef}
            />
            <Text
                fontFamily={elementAttributes.fontFamily}
                fontSize={elementAttributes.fontSize}
                fontWeight={elementAttributes.fontWeight}
                handleInputChange={handleInputChange}
            />
            <Color
                inputRef={colorInputRef}
                attribute={elementAttributes.fill}
                placeholder='color'
                attributeType='fill'
                handleInputChange={handleInputChange}
            />
            <Color
                inputRef={strokeInputRef}
                attribute={elementAttributes.stroke}
                placeholder='stroke'
                attributeType='stroke'
                handleInputChange={handleInputChange}
            />
            <Export />
        </section>
    );
};

export default RightSidebar;
