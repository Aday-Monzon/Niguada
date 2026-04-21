export const getPagination = (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return {
    skip,
    take
  };
};

export const buildPaginationMeta = (page: number, pageSize: number, total: number) => ({
  page,
  pageSize,
  total,
  pageCount: Math.ceil(total / pageSize)
});
