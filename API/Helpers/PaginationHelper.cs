using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class PaginationHelper
{
    public static async Task<PaginatedResult<T>> CreateAsync<T>(IQueryable<T> query, 
    int pageNumber, int pageSize)
{
    var count = await query.CountAsync();
    var items = await query.Skip((pageNumber -1) * pageSize).Take(pageSize).ToListAsync();

    return new PaginatedResult<T>
    {
        MetaData = new PaginationMetaData
        {
            CurrentPage = pageNumber,
            TotalPages = (int)Math.Ceiling(count/ (double)pageSize),
            PageSize = pageSize,
            TotalCount = count
        },
        Items = items
    };
}
}