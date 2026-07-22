/** Filtro Prisma para produtos ativos (não soft-deleted). */
export const ACTIVE_PRODUCT_WHERE = { deletedAt: null } as const;
