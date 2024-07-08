export const NUMERIC_OPERATOR_MAP = {
  gt: '>',
  lt: '<',
  gte: '>=',
  lte: '<=',
  eq: '=',
} as const;

export type NumericOperator = keyof typeof NUMERIC_OPERATOR_MAP;
export const NUMERIC_OPERATORS = Object.keys(NUMERIC_OPERATOR_MAP);

export const DATE_OPERATOR_MAP = {
  after: '>',
  before: '<',
  at: '=',
} as const;

export type DateOperator = keyof typeof DATE_OPERATOR_MAP;
export const DATE_OPERATORS = Object.keys(DATE_OPERATOR_MAP);
