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
            Keywords = "fotografía,fotógrafo,evaristo cuesta,fotografías,fotógrafos,fotos,foto,sevilla"
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

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
