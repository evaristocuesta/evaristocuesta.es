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
            Description = "Esto va de fotos",
            Keywords = "Evaristo Cuesta, fotografía, fotos, arte"
        };
        return View(page);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
