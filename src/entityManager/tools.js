import { Equal, MoreThan, MoreThanOrEqual, LessThanOrEqual, LessThan, In, IsNull, Like, Not } from 'typeorm'

const mapFilters = (filters) => {
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

    return {
        whereObject: whereObject,
        orderObject: orderObject
    }
}

export { mapFilters }
