namespace evaristocuesta.es.Models;

public class PhotoGalleryViewModel : PageViewModel
{
    public string? GalleryId { get; set; }
    public IEnumerable<GalleryItem> GaleriaItems { get; set; } = Enumerable.Empty<GalleryItem>();
}