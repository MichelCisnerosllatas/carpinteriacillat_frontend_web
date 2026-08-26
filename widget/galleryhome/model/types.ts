export type GalleryPreviewItem = {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
};

export type Section3Props = {
    title?: string;
    subtitle?: string;
    items?: GalleryPreviewItem[]; // aquí luego enchufas lo que venga del backend
};
