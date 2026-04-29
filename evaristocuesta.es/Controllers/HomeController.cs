using evaristocuesta.es.Models;
using evaristocuesta.es.ViewModels;
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
        var page = new PageViewModel
        {
            Title = "Evaristo Cuesta - Galería de fotos",
            Description = "Evaristo Cuesta - Galería de fotos. Muestras de fotos de Evaristo Cuesta",
            Keywords = "evaristo,evaristo cuesta,galería,fotos,galería fotos, galería de fotos"
        };
        return View(page);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
