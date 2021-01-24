
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


export interface Ring{
    x: number;
    y: number;
    radius: number;
    strokeWidth: number;
    textureFunction: TextureFunction;
}
export interface TextureFunction{
    url: ()=>any;
}
