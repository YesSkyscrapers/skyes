import { Equal, MoreThan, MoreThanOrEqual, LessThanOrEqual, LessThan, In, IsNull, Like, Not, Between } from 'typeorm'
import { Filters, MapResult } from '../interfaces/interfaces'

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
            case 'like': {
                whereObject = {
                    ...whereObject,
                    [filter.key]: Like(filter.value)
                }
                break
            }
            case 'morethan': {
                whereObject = {
                    ...whereObject,
                    [filter.key]: MoreThan(filter.value)
                }
                break
            }
            case 'morethanorqueal': {
                whereObject = {
                    ...whereObject,
                    [filter.key]: MoreThanOrEqual(filter.value)
                }
                break
            }
            case 'lessthan': {
                whereObject = {
                    ...whereObject,
                    [filter.key]: LessThan(filter.value)
                }
                break
            }
            case 'lessthanorqueal': {
                whereObject = {
                    ...whereObject,
                    [filter.key]: LessThanOrEqual(filter.value)
                }
                break
            }
            case 'between': {
                whereObject = {
                    ...whereObject,
                    [filter.key]: Between(filter.value[0], filter.value[1])
                }
                break
            }
            case 'in': {
                whereObject = {
                    ...whereObject,
                    [filter.key]: In(filter.value)
                }
                break
            }
            case 'notnull': {
                whereObject = {
                    ...whereObject,
                    [filter.key]: Not(IsNull())
                }
                break
            }
            case 'null': {
                whereObject = {
                    ...whereObject,
                    [filter.key]: IsNull()
                }
                break
            }
            case 'equal': {
                whereObject = {
                    ...whereObject,
                    [filter.key]: Equal(filter.value)
                }
                break
            }
            case 'notequal': {
                whereObject = {
                    ...whereObject,
                    [filter.key]: Not(Equal(filter.value))
                }
                break
            }
            case 'order': {
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

export { mapFilters }
