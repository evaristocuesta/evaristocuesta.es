using evaristocuesta.es.Models;
using evaristocuesta.es.Services;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace evaristocuesta.es.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        var page = new PageViewModel
        {
            Title = "Evaristo Cuesta Fotografía",
            Description = "Evaristo Cuesta Fotógrafo autodidacta de Sevilla que trabaja diferentes campos dcomo retratos, reportajes de boda, reportajes de conciertos, books de moda, paisajes, fotografía nocturna, fotografía urbana y fotografía de autor.",
            Keywords = "fotografía,fotógrafo,evaristo cuesta,fotografías,fotógrafos,fotos,foto,sevilla",
            HasHeroImage = true
        };

        return View(page);
    }

    public IActionResult Contacto()
    {
        var page = new PageViewModel
        {
            Title = "Evaristo Cuesta Fotografía - Contacto",
            Description = "Evaristo Cuesta Fotógrafo autodidacta de Sevilla. Página de contacto.",
            Keywords = "fotografía,fotógrafo,evaristo cuesta,fotografías,fotógrafos,fotos,foto,sevilla,contacto"
        };

        return View(page);
    }

    public IActionResult VentaFotografias()
    {
        var page = new PageViewModel
        {
            Title = "Venta de Fotografías de autor para coleccionistas",
            Description = "Evaristo Cuesta Fotografía Fotos Venta de Fotografías de autor",
            Keywords = "fotografía,fotógrafo,evaristo,evaristo cuesta,fotografías,fotografías autor,fotógrafos,fotos,foto,venta,ventas,venta fotografía,venta fotografías,venta fotografía autor"
        };

        return View(page);
    }

    public IActionResult GaleriaFotos()
    {
        var galleryItems = new[]
        {
            new GalleryItem() { Image = "paisajes-naturaleza.jpg", Title = "Paisajes de Naturaleza", Url = "paisajes-naturaleza", Alt = "Fotografía de naturaleza y paisajes" },
            new GalleryItem() { Image = "fotografia-nocturna.jpg", Title = "Fotografía Nocturna", Url = "fotografia-nocturna", Alt = "Fotografía nocturna larga exposición" },
            new GalleryItem() { Image = "fotografia-urbana.jpg", Title = "Fotografía Urbana", Url = "paisajes-urbanos", Alt = "Fotografía urbana y paisajes urbanos" },
            new GalleryItem() { Image = "retratos-books.jpg", Title = "Retratos y Books", Url = "retratos-books-moda", Alt = "Fotógrafo Retratos books moda fotografía en Sevilla" },
            new GalleryItem() { Image = "reportaje-boda.jpg", Title = "Reportajes de Boda", Url = "reportaje-bodas", Alt = "Reportajes de boda fotografía en Sevilla" },
            new GalleryItem() { Image = "fotografia-conciertos.jpg", Title = "Reportajes de Conciertos", Url = "conciertos", Alt = "Fotografía de conciertos música en Sevilla" },
            new GalleryItem() { Image = "reportaje-embarazadas.jpg", Title = "Reportajes de Embarazos", Url = "reportaje-fotos-embarazadas", Alt = "Reportaje embarazadas fotografía en Sevilla" }
        };

        var page = new PhotoGalleryViewModel
        {
            Title = "Evaristo Cuesta - Galería de fotos",
            Description = "Evaristo Cuesta - Galería de fotos. Muestras de fotos de Evaristo Cuesta",
            Keywords = "evaristo,evaristo cuesta,galería,fotos,galería fotos, galería de fotos",
            GaleriaItems = galleryItems
        };

        return View(page);
    }

    public IActionResult GaleriaTipoFotos(string gallery)
    {
        var page = new PhotosService().GetGalleryInfo(gallery);
        return View(page);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
