namespace API.Helpers;

public class PaginatedResult<T>
{
    public PaginationMetaData MetaData { get; set; } = default!;

    public List<T> Items { get; set; } = [];
};

