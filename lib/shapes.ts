import * as fabric from 'fabric';
import { IText, Line, Rect, Triangle, Circle, Image as FabricImage, Object as FabricObject, Canvas } from 'fabric/fabric-impl';
import { v4 as uuidv4 } from 'uuid';

// Extend the types to include the `objectId` property
interface CustomFabricObject extends FabricObject {
    objectId?: string;
}

interface CustomRect extends Rect, CustomFabricObject {}
interface CustomTriangle extends Triangle, CustomFabricObject {}
interface CustomCircle extends Circle, CustomFabricObject {}
interface CustomLine extends Line, CustomFabricObject {}
interface CustomIText extends IText, CustomFabricObject {}
interface CustomImage extends FabricImage, CustomFabricObject {}

export interface ImageUpload {
    file: File;
    canvas: React.MutableRefObject<Canvas | null>;
    shapeRef: React.MutableRefObject<CustomFabricObject | null>;
    syncShapeInStorage: (shape: CustomFabricObject) => void;
}

export interface ModifyShape {
    canvas: Canvas;
    property: 'fill' | 'stroke' | 'strokeWidth' | 'width' | 'height' | string;
    value: string | number;
    activeObjectRef: React.MutableRefObject<CustomFabricObject | null>;
    syncShapeInStorage: (shape: CustomFabricObject) => void;
}

export interface ElementDirection {
    canvas: Canvas;
    direction: 'front' | 'back';
    syncShapeInStorage: (shape: CustomFabricObject) => void;
}

export const createRectangle = (pointer: PointerEvent): CustomRect => {
    return new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 100,
        height: 100,
        fill: '#aabbcc',
    }) as unknown as CustomRect;
};

export const createTriangle = (pointer: PointerEvent): CustomTriangle => {
    return new fabric.Triangle({
        left: pointer.x,
        top: pointer.y,
        width: 100,
        height: 100,
        fill: '#aabbcc',
    }) as unknown as CustomTriangle;
};

export const createCircle = (pointer: PointerEvent): CustomCircle => {
    return new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 50,
        fill: '#aabbcc',
    }) as unknown as CustomCircle;
};

export const createLine = (pointer: PointerEvent): CustomLine => {
    return new fabric.Line(
        [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
        {
            stroke: '#aabbcc',
            strokeWidth: 2,
        },
    ) as unknown as CustomLine;
};

export const createText = (pointer: PointerEvent, text: string): CustomIText => {
    return new fabric.IText(text, {
        left: pointer.x,
        top: pointer.y,
        fill: '#aabbcc',
        fontFamily: 'Helvetica',
        fontSize: 36,
        fontWeight: '400',
    }) as unknown as CustomIText;
};

export const createSpecificShape = (
    shapeType: string,
    pointer: PointerEvent,
): CustomFabricObject | null => {
    let shape: CustomFabricObject | null = null;

    switch (shapeType) {
        case 'rectangle':
            shape = createRectangle(pointer);
            break;
        case 'triangle':
            shape = createTriangle(pointer);
            break;
        case 'circle':
            shape = createCircle(pointer);
            break;
        case 'line':
            shape = createLine(pointer);
            break;
        case 'text':
            shape = createText(pointer, 'Tap to Type');
            break;
        default:
            return null;
    }

    shape.objectId = uuidv4(); // Assign objectId to the shape
    return shape;
};

export const handleImageUpload = ({
    file,
    canvas,
    shapeRef,
    syncShapeInStorage,
}: ImageUpload): void => {
    const reader = new FileReader();

    reader.onload = () => {
        const imageURL = reader.result as string;

        // Typing the callback correctly
        /* @ts-ignore */ // TODO: Maybe this will be working
        fabric.Image.fromURL(imageURL, (img: fabric.Image) => {
            if (img) {
                img.scaleToWidth(200);
                img.scaleToHeight(200);

                const customImage = img as unknown as CustomImage;
                customImage.objectId = uuidv4(); // Assign objectId to the image

                canvas.current?.add(customImage);

                shapeRef.current = customImage;

                syncShapeInStorage(customImage);
                canvas.current?.requestRenderAll();
            }
        });
    };

    reader.readAsDataURL(file);
};

export const createShape = (
    canvas: Canvas,
    pointer: PointerEvent,
    shapeType: string,
): CustomFabricObject | null => {
    if (shapeType === 'freeform') {
        canvas.isDrawingMode = true;
        return null;
    }

    const shape = createSpecificShape(shapeType, pointer);
    if (shape) {
        canvas.add(shape);
    }
    return shape;
};

export const modifyShape = ({
    canvas,
    property,
    value,
    activeObjectRef,
    syncShapeInStorage,
}: ModifyShape): void => {
    const selectedElement = canvas.getActiveObject() as CustomFabricObject;

    if (!selectedElement || selectedElement?.type === 'activeSelection') return;

    if (property === 'width') {
        selectedElement.set('scaleX', 1);
        selectedElement.set('width', value as number);
    } else if (property === 'height') {
        selectedElement.set('scaleY', 1);
        selectedElement.set('height', value as number);
    } else {
        if (selectedElement[property as keyof CustomFabricObject] === value) return;
        selectedElement.set(property as keyof CustomFabricObject, value);
    }

    activeObjectRef.current = selectedElement;

    syncShapeInStorage(selectedElement);
};

export const bringElement = ({
    canvas,
    direction,
    syncShapeInStorage,
}: ElementDirection): void => {
    const selectedElement = canvas.getActiveObject() as CustomFabricObject;

    if (!selectedElement || selectedElement?.type === 'activeSelection') return;

    if (direction === 'front') {
        canvas.bringToFront(selectedElement);
    } else if (direction === 'back') {
        canvas.sendToBack(selectedElement);
    }

    syncShapeInStorage(selectedElement);
};