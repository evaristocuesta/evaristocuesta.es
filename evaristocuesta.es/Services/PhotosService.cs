using evaristocuesta.es.Models;
using System.Text.Json;

namespace evaristocuesta.es.Services;

public class PhotosService
{
    public PageViewModel GetGalleryInfo(string gallery)
    {
        string file = $"wwwroot/images/fotos-{gallery}/data.json";
        string jsonString = File.ReadAllText(file);
        var photoGallery = JsonSerializer.Deserialize<PhotoGalleryViewModel>(jsonString)!;
        photoGallery.GaleriaItems = GetPhotos(gallery, photoGallery.Title, photoGallery.H1);
        return photoGallery;
    }

    public IEnumerable<GalleryItem> GetPhotos(string gallery, string title, string alt)
    {
        string path = $"wwwroot/images/fotos-{gallery}/";

        return Directory.GetFiles(path, "*.jpg")
            .Select(file => new GalleryItem
            {
                    Image = $"/images/fotos-{gallery}/{Path.GetFileName(file)}",
                    Title = title,
                    Alt = alt
                }
            )
            .ToList();

    }
}
