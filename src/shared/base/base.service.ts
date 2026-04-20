import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { RemoveOptions } from 'typeorm/repository/RemoveOptions';
import { ObjectId } from 'typeorm/driver/mongodb/typings';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { BaseRepository } from './base.repository';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

export class BaseService<T> {
  constructor(private readonly repository: BaseRepository<T>) {}

  /**
   * Lấy nhiều bản ghi
   * @param options
   */
  async getRecords(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  /**
   * Lấy 1 bản ghi
   * @param options
   */
  async getRecord(options: FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findOne(options);
  }

  /**
   * Kiểm tra tồn tại theo column
   * @param column
   * @param value
   */
  async isCheckExitsId(column: string, value: number): Promise<boolean> {
    const check = await this.repository
      .createQueryBuilder('a')
      .andWhere(`${column} = :id`, { id: value })
      .getOne();
    return !!check;
  }

  /**
   * Xóa bản ghi
   * @param entities
   * @param options
   */
  async removeRecord(entities: T[], options?: RemoveOptions): Promise<T[]> {
    return this.repository.remove(entities, options);
  }

  /**
   * Tạo hoăc cập nhật bản ghi
   * @param entity
   * @param options
   */
  async saveRecord(entity: T, options?: SaveOptions): Promise<any> {
    return await this.repository.save(entity, options);
  }

  /**
   * Xóa bản ghi
   * @param criteria
   */
  async deleteRecord(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<T>,
  ): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }
}
