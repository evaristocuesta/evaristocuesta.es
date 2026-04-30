var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
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


await app.RunAsync();
