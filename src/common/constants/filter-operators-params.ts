export const FILTER_OPERATOR_PARAMS = ['gt', 'lt', 'eq', 'gte', 'lte'] as const;

export type FilterOperatorParam = (typeof FILTER_OPERATOR_PARAMS)[number];
