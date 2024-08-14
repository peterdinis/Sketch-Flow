'use client';

import Image from 'next/image';
import { memo } from 'react';
import ShapesMenu from './ShapesMenu';
import { ActiveElement, NavbarProps } from '@/app/_types/applicationTypes';
import { navElements } from '@/app/_constants';
import { NewThread } from '../comments/NewThread';
import { Button } from '@/components/ui/button';
import ActiveUsers from '../users/ActiveUsers';

const Navbar = ({
    activeElement,
    imageInputRef,
    handleImageUpload,
    handleActiveElement,
}: NavbarProps) => {
    const isActive = (value: string | Array<ActiveElement>) =>
        (activeElement && activeElement.value === value) ||
        (Array.isArray(value) &&
            value.some((val) => val?.value === activeElement?.value));

    return (
        <nav className='bg-zinc-900 flex select-none items-center justify-between gap-4 px-5 text-white'>
            <h2 className='prose prose-h2: font-bold text-xl text-white'>Sketch Flow</h2>
            <ul className='flex flex-row'>
                {navElements.map((item: ActiveElement | any) => (
                    <li
                        key={item.name}
                        onClick={() => {
                            if (Array.isArray(item.value)) return;
                            handleActiveElement(item);
                        }}
                        className={`group flex items-center justify-center px-2.5 py-5 ${isActive(item.value) ? 'bg-zinc-800' : 'hover:bg-zinc-900'} `}
                    >
                        {/* If value is an array means it's a nav element with sub options i.e., dropdown */}
                        {Array.isArray(item.value) ? (
                            <ShapesMenu
                                item={item}
                                activeElement={activeElement}
                                imageInputRef={imageInputRef}
                                handleActiveElement={handleActiveElement}
                                handleImageUpload={handleImageUpload}
                            />
                        ) : item?.value === 'comments' ? (
                            // If value is comments, trigger the NewThread component
                            <NewThread>
                                <Button className='relative h-5 w-5 object-contain'>
                                    <Image
                                        src={item.icon}
                                        alt={item.name}
                                        fill
                                        className={
                                            isActive(item.value) ? 'invert' : ''
                                        }
                                    />
                                </Button>
                            </NewThread>
                        ) : (
                            <Button className='relative h-5 w-5 object-contain'>
                                <Image
                                    src={item.icon}
                                    alt={item.name}
                                    fill
                                    className={
                                        isActive(item.value) ? 'invert' : ''
                                    }
                                />
                            </Button>
                        )}
                    </li>
                ))}
            </ul>

            <ActiveUsers />
        </nav>
    );
};

export default memo(
    Navbar,
    (prevProps, nextProps) =>
        prevProps.activeElement === nextProps.activeElement,
);
