import { Filter, FilterTypes, FiltersMap } from './types';
declare const mapFilters: <T>(filters: Filter[]) => FiltersMap<T>;
export { mapFilters, FilterTypes };
