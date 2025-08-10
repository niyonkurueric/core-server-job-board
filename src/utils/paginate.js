/**
 * Paginate a SQL query with optional filters.
 * @param {string} baseQuery - The base SQL query (without LIMIT/OFFSET)
 * @param {object} options - { page, pageSize, filters, params, orderBy }
 * @returns {object} { query, params }
 */
export function buildPaginatedQuery(
  baseQuery,
  {
    page = 1,
    pageSize = 10,
    filters = [],
    params = [],
    orderBy = 'created_at DESC',
  } = {}
) {
  let query = baseQuery;
  if (filters.length) {
    query += ' WHERE ' + filters.join(' AND ');
  }
  if (orderBy) {
    query += ' ORDER BY ' + orderBy;
  }
  query += ' LIMIT ? OFFSET ?';
  params.push(pageSize, (page - 1) * pageSize);
  return { query, params };
}
