import { DatabaseError as PgDatabaseError } from 'pg';
import { PostgresErrorCode } from 'src/database/postgres-error-code.enum';

export interface DatabaseError {
  code: PostgresErrorCode;
  table: string;
  detail: string;
}

export function isDatabaseError(error: unknown) {
  return error instanceof PgDatabaseError;
}
