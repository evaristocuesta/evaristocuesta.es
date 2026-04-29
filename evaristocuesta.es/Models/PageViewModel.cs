namespace evaristocuesta.es.Models;

public class PageViewModel
{
    public string Title { get; set; } = string.Empty;
    public string H1 { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
    public IDictionary<string, string> RouteValues { get; set; }
    public bool HasHeroImage { get; set; } = false;

    public PageViewModel()
    {
        RouteValues = new Dictionary<string, string>();
    }
}
