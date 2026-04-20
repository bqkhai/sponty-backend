import { Repository } from 'typeorm';

export class BaseRepository<T> extends Repository<T> {
  // query
  // this.query('select * from user where id = ?', [1])

  async isCheckExitsId(column: string, value: number) {
    const check = await this.createQueryBuilder('a')
      .andWhere(`${column} = :id`, { id: value })
      .getOne();
    return !!check;
  }

  async isCheckExitsField(field: string, parameter) {
    // const check = await this.findOne({
    //   where: { [field]: parameter },
    //   select: [field],
    // });
    // if (check) {
    //   return true;
    // }
    // return false;
  }

  async paginate(alias: string, limit = 10, page = 1) {
    const skip = limit * page - limit;
    return this.createQueryBuilder(alias).skip(skip).take(limit);
  }
}
