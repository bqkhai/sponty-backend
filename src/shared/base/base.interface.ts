import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

export interface Pagination<T extends ObjectLiteral> {
  data: T[];
  count: number;
  page_size?: number;
  total_pages?: number;
}
