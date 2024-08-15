'use client';

import { ShapesMenuProps } from '@/app/_types/applicationTypes';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const ShapesMenu = ({
    item,
    activeElement,
    handleActiveElement,
    handleImageUpload,
    imageInputRef,
}: ShapesMenuProps) => {
    const isDropdownElem = item.value.some(
        (elem) => elem?.value === activeElement.value,
    );

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className='relative h-5 w-5 object-contain'
                        onClick={() => handleActiveElement(item)}
                    >
                        <Image
                            src={
                                isDropdownElem ? activeElement.icon : item.icon
                            }
                            alt={item.name}
                            fill
                            className={isDropdownElem ? 'invert' : ''}
                        />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className='bg-zinc-800 mt-5 flex flex-col gap-y-1 border-none py-4 text-white'>
                    {item.value.map((elem) => (
                        <Button
                            key={elem?.name}
                            onClick={() => {
                                handleActiveElement(elem);
                            }}
                            className={`flex h-fit justify-between gap-10 rounded-none px-5 py-3 focus:border-none ${
                                activeElement.value === elem?.value
                                    ? 'bg-zinc-500'
                                    : 'hover:bg-zinc-800'
                            }`}
                        >
                            <div className='group flex items-center gap-2'>
                                <Image
                                    src={elem?.icon as string}
                                    alt={elem?.name as string}
                                    width={20}
                                    height={20}
                                    className={
                                        activeElement.value === elem?.value
                                            ? 'invert'
                                            : ''
                                    }
                                />
                                <p
                                    className={`text-sm ${
                                        activeElement.value === elem?.value
                                            ? 'text-zinc-900'
                                            : 'text-white'
                                    }`}
                                >
                                    {elem?.name}
                                </p>
                            </div>
                        </Button>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Input
                type='file'
                className='hidden'
                ref={imageInputRef}
                accept='image/*'
                onChange={handleImageUpload}
            />
        </>
    );
};

export default ShapesMenu;
