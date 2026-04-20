import { SelectQueryBuilder } from 'typeorm';
import { BaseQueryDto } from './base.query';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend((utc as any).default || utc);
dayjs.extend((timezone as any).default || timezone);

export class QueryBuilderHelper {
  static applyBaseQuery<T>(
    qb: SelectQueryBuilder<T>,
    query: BaseQueryDto,
    alias: string,
  ) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // 👉 sort
    const sortBy = query.sortBy || `${alias}.createdDate`;
    const sortOrder = query.sortOrder || 'DESC';

    qb.orderBy(sortBy, sortOrder as any);

    // 👉 pagination
    qb.skip(skip).take(limit);

    // 👉 date filter
    if (query.fromDate) {
      const fromDate = dayjs(query.fromDate)
        .tz('Asia/Ho_Chi_Minh')
        .startOf('day')
        .utc()
        .toDate();

      qb.andWhere(`${alias}.createdDate >= :fromDate`, {
        fromDate,
      });
    }

    if (query.toDate) {
      const toDate = dayjs(query.toDate)
        .tz('Asia/Ho_Chi_Minh')
        .endOf('day')
        .utc()
        .toDate();

      qb.andWhere(`${alias}.createdDate <= :toDate`, {
        toDate,
      });
    }

    return { page, limit };
  }

  static applyKeyword<T>(
    qb: SelectQueryBuilder<T>,
    query: BaseQueryDto,
    alias: string,
    fields: string[],
  ) {
    if (!query.keyword) return;

    const conditions = fields
      .map((f) => `LOWER(${alias}.${f}) LIKE :keyword`)
      .join(' OR ');

    qb.andWhere(`(${conditions})`, {
      keyword: `%${query.keyword.toLowerCase()}%`,
    });
  }

  static applyBaseQueryWithoutPagination<T>(
    qb: SelectQueryBuilder<T>,
    query: BaseQueryDto,
    alias: string,
  ) {
    // 👉 chỉ giữ sort + date filter

    const sortBy = query.sortBy || `${alias}.createdDate`;
    const sortOrder = query.sortOrder || 'DESC';

    qb.orderBy(sortBy, sortOrder as any);

    // 👉 date filter
    if (query.fromDate) {
      const fromDate = dayjs(query.fromDate)
        .tz('Asia/Ho_Chi_Minh')
        .startOf('day')
        .utc()
        .toDate();

      qb.andWhere(`${alias}.createdDate >= :fromDate`, {
        fromDate,
      });
    }

    if (query.toDate) {
      const toDate = dayjs(query.toDate)
        .tz('Asia/Ho_Chi_Minh')
        .endOf('day')
        .utc()
        .toDate();

      qb.andWhere(`${alias}.createdDate <= :toDate`, {
        toDate,
      });
    }
  }
}
