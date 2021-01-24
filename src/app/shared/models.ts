import { CirclesTextureType, LinesTextureType, LineTextureOrientation, TextureType } from "./ringdata.service";

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
    // texture: Texture;
}
export interface TextureFunction{
    url: ()=>any;
}

export interface Texture{
    type: TextureType;
    subtype: LinesTextureType | CirclesTextureType;
    value: number;
    orientation?:LineTextureOrientation;
}


export interface CircleTexture{
    
}

export interface LineTexture{

}