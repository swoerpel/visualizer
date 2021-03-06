export interface Dims{
    width: number;
    height: number;
}

export interface Point{
    x: number;
    y: number;
}

export interface Bounds{
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface ColorPalette{
    id: string;
    name?: string;
    colors: string[];
}
