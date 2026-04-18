namespace evaristocuesta.es.ViewModels;

public class PageViewModel
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
    public IDictionary<string, string> RouteValues { get; set; }

    public PageViewModel()
    {
        RouteValues = new Dictionary<string, string>();
    }
}
