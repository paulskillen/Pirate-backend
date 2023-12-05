/* eslint-disable @typescript-eslint/ban-ts-comment */

import { forEach, isEmpty } from 'lodash';
import { Types } from 'mongoose';
import {
    AppHelper,
    IGenerateFilterItem,
    IGenerateFilterQueryProps,
} from 'src/common/helper/app.helper';
import { OrderPaginateInput } from './dto/order.input';

const ORDER_QUERY_KEYS: Array<IGenerateFilterItem<OrderPaginateInput>> = [
    {
        id: 'page',
        key: '_id',
        operator: '$in',
        convertToId: false,
    },
    {
        id: 'status',
        key: 'status',
        operator: '$in',
        convertToId: false,
    },
];

const ORDER_SEARCH_FIELDS: Array<string> = ['name', 'code', 'phone'];

export class OrderHelper {
    static generateFilterQuery<T>(props: IGenerateFilterQueryProps<T>): {
        [key: string]: any;
    } {
        const { listKey, prefix, paginateInput, previous = {} } = props;

        const query = { ...previous };
        if (Array.isArray(listKey) && listKey?.length > 0) {
            forEach(listKey, (item) => {
                const {
                    id,
                    key,
                    operator,
                    convertToId,
                    isRangeData,
                    transformer,
                } = item;
                let value = paginateInput?.[id] ?? null;
                const queryKey = prefix ? `${prefix}.${key}` : key;
                if (!isEmpty(value) || typeof value === 'boolean') {
                    if (!transformer && typeof transformer !== 'function') {
                        if (convertToId) {
                            if (value?.length > 0 && Array.isArray(value)) {
                                value = value.map((i) => new Types.ObjectId(i));
                            } else {
                                value = new Types.ObjectId(value);
                            }
                        }
                        if (isRangeData) {
                            value = { $gte: value[0], $lte: value[1] };
                        }
                        if (operator) {
                            query[queryKey] = { [operator]: value };
                        } else {
                            query[queryKey] = value;
                        }
                    } else {
                        const trans = transformer(value, paginateInput);
                        Object.assign(query, trans);
                    }
                }
            });
        }

        return query;
    }

    static getFilterOrderQuery = (
        props: IGenerateFilterQueryProps<OrderPaginateInput>,
        options?: any,
    ): { [key: string]: any } => {
        const {
            listKey = ORDER_QUERY_KEYS,
            prefix,
            paginateInput,
            previous = {},
        } = props;
        const { searchUser = true, searchRequest = false } = options || {};
        const { startDate, endDate, ...rest } = paginateInput || {};

        const query = OrderHelper.generateFilterQuery({
            listKey,
            prefix,
            paginateInput: rest,
            previous: { $or: [], ...previous },
        });

        if (startDate && endDate) {
            Object.assign(query, {
                // created: getRangeDateQuery(startDate, endDate),
            });
        }

        if (paginateInput.search) {
            const searchReqQuery = AppHelper.generateSearchQuery(
                paginateInput,
                ORDER_SEARCH_FIELDS,
                query,
            );
            if (searchReqQuery && searchReqQuery?.$or?.length > 0) {
                searchReqQuery?.$or.forEach((iQuery) => query.$or.push(iQuery));
            }
        }
        if (!(query?.$or?.length > 0)) {
            delete query.$or;
        }
        return query;
    };

    static getAggregateOrderQuery = (
        paginateInput: OrderPaginateInput,
        auth: any,
    ): Array<any> => {
        let userEmployeeIdsObj = [];
        const userEmployeeIds = auth?.relationshipManagement?.employeeId ?? [];
        if (userEmployeeIds?.length > 0) {
            userEmployeeIdsObj = userEmployeeIds.map(
                (i) => new Types.ObjectId(i),
            );
        }

        //@ts-ignore
        const matchReq = this.getFilterCustomRequestQuery({
            previous: {},
            filterInput: paginateInput,
        });
        let $sort: any = {};
        if (!isEmpty(paginateInput?.sort)) {
            const sortRes = AppHelper.generateSortQuery([paginateInput.sort]);
            if (!isEmpty(sortRes?.sort)) {
                $sort = sortRes?.sort;
            }
        }
        const $project = {
            id: '$_id',
            templateId: 1,
            createdByAdmin: 1,
        };
        const aggregate: Array<any> = [{ $match: matchReq }, { $sort }];

        // add filter employee query

        // const $lookup = {
        //   from: 'users',
        //   localField: 'employeeId',
        //   foreignField: '_id',
        //   as: USER_COLLECTION_JOINED_KEY,
        // };

        // const matchUser = this.getFilterUserQuery({
        //   filterInput: paginateInput,
        //   prefix: USER_COLLECTION_JOINED_KEY,
        // });

        // if (some(matchUser, (value, key) => !isEmpty(value))) {
        //   aggregate.push({ $lookup });
        //   aggregate.push({ $match: matchUser });
        // }

        // aggregate.push({ $project });
        return aggregate;
    };
}
