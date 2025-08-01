export enum ViewTypeEnum {
    GRID = "grid",
    LIST = "list",
}

export enum SortedOptionsEnum {
    DATE_ASC = "date asc",
    DATE_DESC = "date desc",
    NAME_ASC = "name asc",
    NAME_DESC = "name desc",
    SIZE_ASC = "size asc",
    SIZE_DESC = "size desc",
}

export enum SliderLayoutTypeEnum {
    CAROUSEL = "carousel",
    STACK = "stack",
    SINGLE = "single",
    THUMBNAILS = "thumbnails",
}

export enum PlacementTypeEnum {
    HOME = "hone",
    PRODUCT = "product",
}

export interface FilterOptionsType {
    queryValue: null | string;
    minSize: null | string;
    maxSize: null | string;
    selectedProduct: null | string;
    viewType: ViewTypeEnum;
    sortSelected: SortedOptionsEnum[];
}

export interface VideoType {
    id: string;
    thumbnailUrl: string;
    videoUrl: string;
    filename: string;
    duration: number;
    format: string;
    size: number;
    createdAt: string;
    productIds: string[];
}

export interface SliderObjectType {
    title: string;
    layoutType: SliderLayoutTypeEnum;
    videosPerRow: string;
    slides: SlideType[];
}

export interface SliderVariantType {
    title: string;
    price: string;
    compareAtPrice: string | null;
    shopifyVariantId: string;
}

export interface SliderProductType {
    thumbnailUrl: string | null;
    title: string;
    shopifyProductId: string;
    price?: string | null;
    compareAtPrice?: string | null;
    handle: string;
    variant: SliderVariantType;
}

export interface SlideType {
    videoId: string;
    product?: SliderProductType;
}
