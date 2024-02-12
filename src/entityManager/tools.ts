import { Equal, MoreThan, MoreThanOrEqual, LessThanOrEqual, LessThan, In, IsNull, Like, Not, Between } from 'typeorm'
import { Filters, MapResult } from '../interfaces/interfaces'

const FilterTypes = {
    LIKE: 'like',
    MORE_THAN: 'morethan',
    MORE_THAN_OR_EQUAL: 'morethanorqueal',
    LESS_THAN: 'lessthan',
    LESS_THAN_OR_EQUAL: 'lessthanorqueal',
    BETWEEN: 'between',
    IN: 'in',
    NOT_NULL: 'notnull',
    NULL: 'null',
    EQUAL: 'equal',
    NOT_EQUAL: 'notequal',
    ORDER: 'order'
}

const mapFilters = (filters: Filters) => {
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
                whereObject = {
                    ...whereObject,
                    [filter.key]: Between(filter.value[0], filter.value[1])
                }
                break
            }
            case FilterTypes.IN: {
                whereObject = {
                    ...whereObject,
                    [filter.key]: In(filter.value)
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

    let result: MapResult = {
        whereObject: whereObject,
        orderObject: orderObject
    }

    return result
}

export { mapFilters, FilterTypes }
