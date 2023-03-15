/* eslint-disable @typescript-eslint/ban-ts-comment */

import { forEach, isEmpty } from 'lodash';
import { Types } from 'mongoose';
import {
    AppHelper,
    IGenerateFilterItem,
    IGenerateFilterQueryProps,
} from 'src/common/helper/app.helper';
import { CustomerPaginateRequest } from './dto/customer.input';
import { Customer } from './schema/customer.schema';

const CUSTOMER_QUERY_KEYS: Array<IGenerateFilterItem<CustomerPaginateRequest>> =
    [
        {
            id: 'page',
            key: '_id',
            operator: '$in',
            convertToId: true,
        },
    ];

const CUSTOMER_SEARCH_FIELDS: Array<string> = [
    'firstNameTh',
    'lastNameTh',
    'firstNameEn',
    'lastNameEn',
    'nickname',
    'phone',
    'email',
];

export class CustomerHelper {
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

    static getFilterCustomerQuery = (
        props: IGenerateFilterQueryProps<CustomerPaginateRequest>,
        options?: any,
    ): { [key: string]: any } => {
        const {
            listKey = CUSTOMER_QUERY_KEYS,
            prefix,
            paginateInput,
            previous = {},
        } = props;
        const { searchUser = true, searchRequest = false } = options || {};
        const { startDate, endDate, ...rest } = paginateInput || {};

        const query = CustomerHelper.generateFilterQuery({
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
                CUSTOMER_SEARCH_FIELDS,
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

    static getAggregateCustomerQuery = (
        paginateInput: CustomerPaginateRequest,
        auth: any,
    ): Array<any> => {
        let userEmployeeIdsObj = [];
        const userEmployeeIds = auth?.relationshipManagement?.employeeId ?? [];
        if (userEmployeeIds?.length > 0) {
            userEmployeeIdsObj = userEmployeeIds.map(
                (i) => new Types.ObjectId(i),
            );
        }

        const matchReq = CustomerHelper.getFilterCustomerQuery({
            previous: {},
            paginateInput,
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
            requestId: 1,
            status: 1,
            employeeId: 1,
            created: 1,
            content: 1,
            customType: 1,
            createdBy: 1,
            createByAdmin: 1,
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

    static checkIsCustomer = (customer: Customer): boolean => {
        return !!customer?.customerNo ?? null;
    };
}
