import { Filters, MapResult } from '../interfaces/interfaces';
declare const FilterTypes: {
    LIKE: string;
    MORE_THAN: string;
    MORE_THAN_OR_EQUAL: string;
    LESS_THAN: string;
    LESS_THAN_OR_EQUAL: string;
    BETWEEN: string;
    IN: string;
    NOT_NULL: string;
    NULL: string;
    EQUAL: string;
    NOT_EQUAL: string;
    ORDER: string;
};
declare const mapFilters: (filters: Filters) => MapResult;
export { mapFilters, FilterTypes };
