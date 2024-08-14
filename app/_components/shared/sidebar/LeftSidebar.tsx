'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';

import { getShapeInfo } from '@/lib/utils';

const LeftSidebar = ({
    allShapes: initialShapes,
    onDeleteShape,
  }: {
    allShapes: Array<any>;
    onDeleteShape: (objectId: string) => void;
  }) => {
    const [allShapes, setAllShapes] = useState(initialShapes);
  
    const handleDeleteShape = (objectId: string) => {
      setAllShapes(allShapes.filter((shape) => shape[1]?.objectId !== objectId));
      onDeleteShape(objectId); // Call the passed delete handler
    };
  
    const memoizedShapes = useMemo(
      () => (
        <section className="bg-zinc-900 text-white sticky left-0 flex h-full min-w-[227px] select-none flex-col overflow-y-auto border-t pb-20 max-sm:hidden">
          <h3 className="prose prose-h3: font-bold text-lg text-white border-primary-grey-200 border px-5 py-4 uppercase">
            Layers
          </h3>
          <div className="flex flex-col">
            {allShapes?.map((shape: any) => {
              const info = getShapeInfo(shape[1]?.type);
  
              return (
                <div
                  key={shape[1]?.objectId}
                  className="hover:bg-zinc-800 hover:text-primary-black group my-1 flex items-center gap-2 px-5 py-2.5 hover:cursor-pointer relative"
                >
                  <Image
                    src={info?.icon}
                    alt="Layer"
                    width={16}
                    height={16}
                    className="group-hover:invert"
                  />
                  <h3 className="text-lg prose prose-h3: text-white font-semibold capitalize">
                    {info.name}
                  </h3>
                  <button
                    onClick={() => handleDeleteShape(shape[1]?.objectId)}
                    className="absolute right-5 text-red-500 hover:text-red-700"
                  >
                    &#x2715;
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ),
      [allShapes],
    );
  
    return memoizedShapes;
  };
  
  export default LeftSidebar;