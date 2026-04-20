import { Logger, QueryRunner } from 'typeorm';

export class CustomLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (/UPDATE `invoice` SET `data`/.test(query)) {
      console.log('[Query] UPDATE invoice ... (omitted)');
      return;
    }

    const safeParams = parameters?.map((p) =>
      typeof p === 'string' && p.length > 50 ? p.slice(0, 20) + '...' : p,
    );

    console.log('[Query]', query, safeParams);
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    console.error('[QueryError]', error, query, parameters);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    console.warn(`[QuerySlow: ${time}ms]`, query, parameters);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    console[level]('[TypeORM]', message);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    console.log('[Migration]', message);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    console.log('[SchemaBuild]', message);
  }
}
