import { PaginateResult, AggregatePaginateResult } from 'mongoose';
import { async } from 'rxjs';
import {
    PaginateRequest,
    PaginateResponse,
} from '../paginate/dto/paginate.dto';

export interface IPaginationResult {
    data: Array<any>;
    pagination: PaginateResponse;
}

export class PaginateHelper {
    constructor(public getPaginationResult: (props: any) => any) {}

    static getPaginationResult = async (
        res: PaginateResult<any> | AggregatePaginateResult<any>,
        transformer?: (data: any) => Promise<any>,
    ): Promise<IPaginationResult> => {
        const {
            total,
            limit,
            offset,
            page,
            pages,
            totalDocs,
            totalPages,
            docs,
        } = res as PaginateResult<any> & AggregatePaginateResult<any>;
        let transDoc = docs;
        if (transformer) {
            transDoc = await transformer(docs);
        }
        return {
            data: transDoc,
            pagination: {
                items: totalDocs || total,
                page,
                total: totalPages || pages,
            },
        };
    };

    static getPaginationRequest = (
        pagination: any,
    ): { page: number; limit: number } => {
        const { page, limit } = pagination;
        return { page, limit };
    };

    static getSearchRequest = (pagination: any) => {
        const { search } = pagination;
        if (!search) {
            return {};
        }
        return {
            $text: { $search: search },
        };
    };

    static getPaginationFromJson = async (
        allData: Array<any>,
        paginateInput: PaginateRequest,
    ): Promise<IPaginationResult> => {
        const pageNumber = paginateInput.page || 1;
        const pageSize = paginateInput.limit || 20;
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const items = allData?.length ?? 0;
        const totalPages = Math.ceil(items / pageSize);
        const data = allData.slice(startIndex, endIndex);
        return {
            data,
            pagination: {
                items,
                page: pageNumber,
                total: totalPages,
            },
        };
    };
}
