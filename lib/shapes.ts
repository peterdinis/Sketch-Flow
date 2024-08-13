import fabric, { IText, Line, Rect, Triangle, Circle, Image as FabricImage, Object as FabricObject, Canvas, IRectOptions } from 'fabric/fabric-impl';
import { v4 as uuidv4 } from 'uuid';

export type CustomFabricObject = FabricObject & IRectOptions & { objectId?: string };

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

export const createRectangle = (pointer: PointerEvent): CustomFabricObject => {
    return new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 100,
        height: 100,
        fill: '#aabbcc',
        objectId: uuidv4(),
    }) as unknown as CustomFabricObject;
};

export const createTriangle = (pointer: PointerEvent): CustomFabricObject => {
    return new fabric.Triangle({
        left: pointer.x,
        top: pointer.y,
        width: 100,
        height: 100,
        fill: '#aabbcc',
        objectId: uuidv4(),
    }) as CustomFabricObject;
};

export const createCircle = (pointer: PointerEvent): CustomFabricObject => {
    return new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 50,
        fill: '#aabbcc',
        objectId: uuidv4(),
    }) as CustomFabricObject;
};

export const createLine = (pointer: PointerEvent): CustomFabricObject => {
    return new fabric.Line(
        [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
        {
            stroke: '#aabbcc',
            strokeWidth: 2,
            objectId: uuidv4(),
        },
    ) as CustomFabricObject;
};

export const createText = (pointer: PointerEvent, text: string): CustomFabricObject => {
    return new fabric.IText(text, {
        left: pointer.x,
        top: pointer.y,
        fill: '#aabbcc',
        fontFamily: 'Helvetica',
        fontSize: 36,
        fontWeight: '400',
        objectId: uuidv4(),
    }) as CustomFabricObject;
};

export const createSpecificShape = (
    shapeType: string,
    pointer: PointerEvent,
): CustomFabricObject | null => {
    switch (shapeType) {
        case 'rectangle':
            return createRectangle(pointer);
        case 'triangle':
            return createTriangle(pointer);
        case 'circle':
            return createCircle(pointer);
        case 'line':
            return createLine(pointer);
        case 'text':
            return createText(pointer, 'Tap to Type');
        default:
            return null;
    }
};

export const handleImageUpload = ({
    file,
    canvas,
    shapeRef,
    syncShapeInStorage,
}: ImageUpload): void => {
    const reader = new FileReader();

    reader.onload = () => {
        fabric.Image.fromURL(reader.result as string, (img: FabricImage | null) => {
            if (img) {
                img.scaleToWidth(200);
                img.scaleToHeight(200);

                canvas.current?.add(img);

                (img as CustomFabricObject).objectId = uuidv4();

                shapeRef.current = img as CustomFabricObject;

                syncShapeInStorage(img as CustomFabricObject);
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
        selectedElement.set('width', value as unknown as number);
    } else if (property === 'height') {
        selectedElement.set('scaleY', 1);
        selectedElement.set('height', value as unknown as number);
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