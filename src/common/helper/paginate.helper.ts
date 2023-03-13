import { PaginateResult, AggregatePaginateResult } from 'mongoose';
import { async } from 'rxjs';
import { PaginateResponse } from '../paginate/dto/paginate.dto';

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
    const { total, limit, offset, page, pages, totalDocs, totalPages, docs } =
      res as PaginateResult<any> & AggregatePaginateResult<any>;
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
}
