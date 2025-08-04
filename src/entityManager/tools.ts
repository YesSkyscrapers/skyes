import { Equal, MoreThan, MoreThanOrEqual, LessThanOrEqual, LessThan, In, IsNull, Like, Not, Between } from 'typeorm'
import { Filter, FilterTypes, FiltersMap } from './types'

const mapFilters = <T>(filters: Filter[]) => {
    let whereObject = {}
    let orderObject = {}

    if (filters.length == 0) {
        return {
            whereObject: undefined,
            orderObject: undefined
        }
    }

    filters.forEach((filter) => {
        switch (filter.type) {
            case FilterTypes.LIKE: {
                whereObject = {
                    ...whereObject,
                    [filter.key]: Like(filter.value)
                }
                break
            }
            case FilterTypes.MORE_THAN: {
                whereObject = {
                    ...whereObject,
                    [filter.key]: MoreThan(filter.value)
                }
                break
            }
            case FilterTypes.MORE_THAN_OR_EQUAL: {
                whereObject = {
                    ...whereObject,
                    [filter.key]: MoreThanOrEqual(filter.value)
                }
                break
            }
            case FilterTypes.LESS_THAN: {
                whereObject = {
                    ...whereObject,
                    [filter.key]: LessThan(filter.value)
                }
                break
            }
            case FilterTypes.LESS_THAN_OR_EQUAL: {
                whereObject = {
                    ...whereObject,
                    [filter.key]: LessThanOrEqual(filter.value)
                }
                break
            }
            case FilterTypes.BETWEEN: {
                if (Array.isArray(filter.value)) {
                    whereObject = {
                        ...whereObject,
                        [filter.key]: Between(filter.value[0], filter.value[1])
                    }
                }
                break
            }
            case FilterTypes.IN: {
                if (Array.isArray(filter.value)) {
                    whereObject = {
                        ...whereObject,
                        [filter.key]: In(filter.value)
                    }
                }
                break
            }
            case FilterTypes.NOT_NULL: {
                whereObject = {
                    ...whereObject,
                    [filter.key]: Not(IsNull())
                }
                break
            }
            case FilterTypes.NULL: {
                whereObject = {
                    ...whereObject,
                    [filter.key]: IsNull()
                }
                break
            }
            case FilterTypes.EQUAL: {
                whereObject = {
                    ...whereObject,
                    [filter.key]: Equal(filter.value)
                }
                break
            }
            case FilterTypes.NOT_EQUAL: {
                whereObject = {
                    ...whereObject,
                    [filter.key]: Not(Equal(filter.value))
                }
                break
            }
            case FilterTypes.ORDER: {
                orderObject = {
                    ...orderObject,
                    [filter.key]: filter.value
                }
            }
        }
    })

    let result: FiltersMap<T> = {
        whereObject: whereObject,
        orderObject: orderObject
    }

    return result
}

export { mapFilters, FilterTypes }
