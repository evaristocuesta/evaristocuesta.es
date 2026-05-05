using AspNetStatic;
using evaristocuesta.es.Extensions;
using Microsoft.AspNetCore.Hosting.StaticWebAssets;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var outputPath = args.Length >= 2 ? $"{args[1]}" : string.Empty;
var basePath = args.Length == 3 ? $"/{args[2]}" : string.Empty;

if (args.HasSsgArg())
{
    builder.Services.AddSingleton<IStaticResourcesInfoProvider>(new StaticResourcesInfoProvider());
}

StaticWebAssetsLoader.UseStaticWebAssets(
    builder.Environment,
    builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UsePathBase(basePath);
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "/",
    pattern: "/",
    defaults: new { controller = "Home", action = "Index" })
    .WithStaticAssets();

app.MapControllerRoute(
    name: "contacto",
    pattern: "contacto",
    defaults: new { controller = "Home", action = "Contacto" })
    .WithStaticAssets();

app.MapControllerRoute(
    name: "venta-fotografias",
    pattern: "venta-fotografias",
    defaults: new { controller = "Home", action = "VentaFotografias" })
    .WithStaticAssets();

app.MapControllerRoute(
    name: "galeria-fotos",
    pattern: "galeria-fotos",
    defaults: new { controller = "Home", action = "GaleriaFotos" })
    .WithStaticAssets();

app.MapControllerRoute(
    name: "paisajes-naturaleza",
    pattern: "paisajes-naturaleza",
    defaults: new { controller = "Home", action = "GaleriaTipoFotos", gallery = "paisajes-naturaleza" })
    .WithStaticAssets();

app.MapControllerRoute(
    name: "fotografia-nocturna",
    pattern: "fotografia-nocturna",
    defaults: new { controller = "Home", action = "GaleriaTipoFotos", gallery = "fotografia-nocturna" })
    .WithStaticAssets();

app.MapControllerRoute(
    name: "paisajes-urbanos",
    pattern: "paisajes-urbanos",
    defaults: new { controller = "Home", action = "GaleriaTipoFotos", gallery = "paisajes-urbanos" })
    .WithStaticAssets();

app.MapControllerRoute(
    name: "retratos-books-moda",
    pattern: "retratos-books-moda",
    defaults: new { controller = "Home", action = "GaleriaTipoFotos", gallery = "retratos-books-moda" })
    .WithStaticAssets();

app.MapControllerRoute(
    name: "reportaje-bodas",
    pattern: "reportaje-bodas",
    defaults: new { controller = "Home", action = "GaleriaTipoFotos", gallery = "reportaje-bodas" })
    .WithStaticAssets();

app.MapControllerRoute(
    name: "conciertos",
    pattern: "conciertos",
    defaults: new { controller = "Home", action = "GaleriaTipoFotos", gallery = "conciertos" })
    .WithStaticAssets();

app.MapControllerRoute(
    name: "reportaje-fotos-embarazadas",
    pattern: "reportaje-fotos-embarazadas",
    defaults: new { controller = "Home", action = "GaleriaTipoFotos", gallery = "reportaje-fotos-embarazadas" })
    .WithStaticAssets();

if (args.HasSsgArg())
{
    app.ConfigureAspNetStatic(basePath, outputPath);
    app.GenerateStaticContent(outputPath);
}

await app.RunAsync();
