namespace evaristocuesta.es.Models;

public class PhotoGalleryViewModel : PageViewModel
{
    public IEnumerable<GalleryItem> GaleriaItems { get; set; } = Enumerable.Empty<GalleryItem>();
}