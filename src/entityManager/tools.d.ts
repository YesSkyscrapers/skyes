import { Filters } from ".";

interface MapResult {
    whereObject: any,
    orderObject: any
}

export function mapFilters(filters: Filters): MapResult;