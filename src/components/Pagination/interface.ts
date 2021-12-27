export interface PaginationProps {
    numberOfPages: number;
    onChange(selectedPage: number): void;
    overrideSelectedPage?: number;
}
