"use client";

import { Attributes, FC, useEffect, useRef, useState } from "react";
import {
    handleCanvasMouseDown,
    handleCanvasMouseUp,
    handleCanvasObjectModified,
    handleCanvasObjectScaling,
    handleCanvasSelectionCreated,
    handleResize,
    initializeFabric,
    renderCanvas,
} from "@/lib/canvas";
import { useMutation, useRedo, useStorage, useUndo } from "@/liveblocks.config";
import { handleImageUpload } from "@/lib/shapes";
import { defaultNavElement } from "@/app/_constants";
import { ActiveElement } from "@/app/_types/applicationTypes";
import Live from "../shared/Live";
import Navbar from "../shared/Navbar";
import LeftSidebar from "../shared/sidebar/LeftSidebar";
import RightSidebar from "../shared/sidebar/RightSidebar";

const HomeWrapper: FC = () => {
    const undo = useUndo();
    const redo = useRedo();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const isDrawing = useRef(false);
    const shapeRef = useRef<fabric.Object | null>(null);
    const selectedShapeRef = useRef<string | null>(null);

    const activeObjectRef = useRef<fabric.Object | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const isEditingRef = useRef(false);

    const [activeElement, setActiveElement] = useState<ActiveElement>(defaultNavElement);

    const [elementAttributes, setElementAttributes] = useState<Attributes>({
        width: ""
        height: "",
        fontSize: "",
        fontFamily: "",
        fontWeight: "",
        fill: "#aabbcc",
        stroke: "#aabbcc",
    });

    const canvasObjects = useStorage((root) => root.canvasObjects);

    const syncShapeInStorage = useMutation(({ storage }, object) => {
        if (!object) return;

        const { objectId } = object;

        const shapeData = object.toJSON();
        shapeData.objectId = objectId;

        const canvasObjects = storage.get("canvasObjects");

        canvasObjects.set(objectId, shapeData);
    }, []);

    const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
        const canvasObjects = storage.get("canvasObjects");
        canvasObjects.delete(shapeId);
    }, []);

    const deleteAllShapes = useMutation(({ storage }) => {
        const canvasObjects = storage.get("canvasObjects");
        canvasObjects.clear();
    }, []);

    useEffect(() => {
        const canvas = initializeFabric({ fabricRef, canvasRef });

        window.addEventListener("resize", () => handleResize({ canvas }));

        canvas.on("mouse:down", (options) =>
            handleCanvasMouseDown({
                options,
                canvas,
                selectedShapeRef,
                isDrawing,
                shapeRef,
            })
        );

        canvas.on("mouse:move", (options) =>
            handleCanvasMouseMove({
                options,
                canvas,
                isDrawing,
                selectedShapeRef,
                shapeRef,
                syncShapeInStorage,
            })
        );

        canvas.on("mouse:up", () =>
            handleCanvasMouseUp({
                canvas,
                isDrawing,
                shapeRef,
                activeObjectRef,
                selectedShapeRef,
                syncShapeInStorage,
                setActiveElement,
            })
        );

        canvas.on("object:modified", (options) =>
            handleCanvasObjectModified({
                options,
                syncShapeInStorage,
            })
        );

        canvas.on("object:scaling", (options) =>
            handleCanvasObjectScaling({
                options,
                setElementAttributes,
            })
        );

        canvas.on("selection:created", (options) =>
            handleCanvasSelectionCreated({
                options,
                isEditingRef,
                setElementAttributes,
            })
        );

        return () => {
            window.removeEventListener("resize", () => handleResize({ canvas }));
            canvas.dispose();
        };
    }, []);

    useEffect(() => {
        if (fabricRef.current) {
            renderCanvas({
                fabricRef,
                canvasObjects,
                activeObjectRef,
            });
        }
    }, [canvasObjects]);

    return (
        <div className="home-wrapper">
            <Navbar
                activeElement={activeElement}
                imageInputRef={imageInputRef}
                handleImageUpload={(e) =>
                    handleImageUpload({
                        e,
                        fabricRef,
                        imageInputRef,
                        syncShapeInStorage,
                    })
                }
                handleActiveElement={setActiveElement}
            />
            <div className="canvas-container">
                <LeftSidebar allShapes={[]} />
                <div className="canvas-wrapper">
                    <canvas id="canvas" ref={canvasRef} />
                </div>
                <RightSidebar
                    elementAttributes={elementAttributes as any}
                    setElementAttributes={setElementAttributes as any}
                    fabricRef={fabricRef}
                    activeObjectRef={activeObjectRef}
                    isEditingRef={isEditingRef}
                    syncShapeInStorage={syncShapeInStorage}
                />
            </div>
            <Live canvasRef={undefined} undo={function (): void {
                throw new Error("Function not implemented.");
            } } redo={function (): void {
                throw new Error("Function not implemented.");
            } } />
        </div>
    );
};

export default HomeWrapper;