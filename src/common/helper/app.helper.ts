import { isEmpty, map } from 'lodash';
import * as moment from 'moment';
import { PaginateRequest } from '../paginate/dto/paginate.dto';
import { Types } from 'mongoose';

export interface IGenerateFilterItem<T> {
    id: keyof T;
    key: string;
    operator?: string;
    convertToId?: boolean;
    isRangeData?: boolean;
    transformer?: (
        value: any,
        filterInput: any,
    ) => { [key: string]: any } | null;
}

export interface IGenerateFilterQueryProps<T> {
    paginateInput: any;
    prefix?: string;
    listKey?: Array<IGenerateFilterItem<T>>;
    previous?: any;
}

export type SortDataType = 'ascend' | 'descend';

export interface IGetSortQueryResult {
    sort?: { [key: string]: 1 | -1 };
}

export interface IGenerateSortQueryProps<T> {
    field: keyof T;
    order?: SortDataType;
}

export class AppHelper {
    static generateRegQuery = (key: string, value: string) => {
        return {
            [key]: {
                $regex: value,
                $options: 'i',
            },
        };
    };

    static generateSearchQuery = (
        pagination: PaginateRequest,
        keys: string[],
        previous: any = {},
        options?: any,
    ): any => {
        const result = { ...previous };
        const $or: Array<any> = [];
        if (pagination?.search && keys && keys?.length > 0) {
            keys.forEach((key) => {
                $or.push(AppHelper.generateRegQuery(key, pagination.search));
            });
            if ($or?.length > 0) {
                Object.assign(result, { $or });
            }
        }
        return result;
    };

    static generateSortQuery<T>(
        sortKeys: IGenerateSortQueryProps<T>[],
        listQueryKeys: Array<any> = [],
    ): IGetSortQueryResult {
        const sortQuery: any = {};
        if (sortKeys && sortKeys?.length > 0) {
            sortKeys.forEach((sortKey) => {
                const { field, order = 'ascend' } = sortKey;
                const foundData = listQueryKeys.find(
                    (item) => item?.id === field,
                );
                const queryKey = foundData?.key ?? null;
                if (queryKey) {
                    Object.assign(sortQuery, {
                        [queryKey]: order === 'ascend' ? 1 : -1,
                    });
                }
            });
        }
        return { sort: sortQuery };
    }

    static addObjectIdToList = (list: Array<any>) => {
        if (isEmpty(list)) {
            return [];
        }
        return map(list, (item) => {
            const { id, _id } = item;
            const objectId = Types.ObjectId.isValid(id)
                ? id
                : Types.ObjectId.isValid(_id)
                ? _id
                : null;
            if (objectId) {
                item._id = objectId;
            } else {
                item._id = new Types.ObjectId();
            }
            if (item.id) {
                delete item.id;
            }
            return item;
        });
    };

    static addLeadingZeros(num, totalLength) {
        return String(num).padStart(totalLength, '0');
    }

    static generateIdWithCode(
        lastId: string,
        code: string,
        dateTime: string,
        numberOfDigit = 5,
    ): string | null {
        const lastIdRemoveCode = lastId.replace(/^\D+/g, '');
        const lastIdRemoveTime = lastIdRemoveCode.substring(6);
        const lastIdNumber = parseInt(lastIdRemoveTime.replace(/^\D+/g, ''));
        if (isNaN(lastIdNumber)) {
            console.error(
                `Error when create new Id Number ! Last Id Number ${lastId} is invalid!`,
            );
            return null;
        }
        const newIdNumber = isNaN(lastIdNumber) ? 1 : lastIdNumber + 1;
        const newIdNumberWithZero = AppHelper.addLeadingZeros(
            newIdNumber,
            numberOfDigit,
        );
        const newId = `${code}${dateTime}${newIdNumberWithZero}`;
        return newId;
    }

    static generateNextDataNo(
        lastId: string,
        code: string,
        dateTime: string,
        numberOfDigit = 5,
    ): string | null {
        const lastIdRemoveCode = lastId.replace(/^\D+/g, '');
        const lastIdRemoveTime = lastIdRemoveCode.substring(6);
        const lastIdNumber = parseInt(lastIdRemoveTime.replace(/^\D+/g, ''));
        if (isNaN(lastIdNumber)) {
            console.error(
                `Error when create new Id Number ! Last Id Number ${lastId} is invalid!`,
            );
            return null;
        }
        const newIdNumber = isNaN(lastIdNumber) ? 1 : lastIdNumber + 1;
        const newIdNumberWithZero = AppHelper.addLeadingZeros(
            newIdNumber,
            numberOfDigit,
        );
        const newId = `${code}${dateTime}${newIdNumberWithZero}`;
        return newId;
    }
}
