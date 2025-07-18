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
    filename: string;
    duration: number;
    format: string;
    size: number;
    createdAt: string;
    productIds: string[];
}
