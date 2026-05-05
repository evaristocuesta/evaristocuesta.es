using Microsoft.Playwright;

namespace evaristocuesta.es.tests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class Tests : PageTest
{
    private string _baseUrl = string.Empty;
    private static readonly HashSet<string> CheckedLinks = new();
    private static readonly HashSet<string> CheckedImages = new();
    private static readonly HashSet<string> CheckedCssAndJs = new();
    private static readonly Dictionary<string, int> LinksHttpErrors = [];

    [TestCase("")]
    [TestCase("contacto")]
    [TestCase("venta-fotografias")]
    [TestCase("galeria-fotos")]
    [TestCase("paisajes-naturaleza")]
    [TestCase("fotografia-nocturna")]
    [TestCase("paisajes-urbanos")]
    [TestCase("retratos-books-moda")]
    [TestCase("reportaje-bodas")]
    [TestCase("conciertos")]
    [TestCase("reportaje-fotos-embarazadas")]
    public async Task VerifyAllImagesExist(string pageUrl)
    {
        await Page.GotoAsync(pageUrl);

        var images = await Page.QuerySelectorAllAsync("img");

        var srcs = (await Task.WhenAll(images.Select(async link => await link.GetAttributeAsync("src"))))
            .Where(href => !string.IsNullOrEmpty(href))
            .Distinct()
            .ToList();

        using var httpClient = new HttpClient();

        foreach (var src in srcs)
        {
            if (!string.IsNullOrEmpty(src))
            {
                // Ensure the URL is absolute
                var imageUrl = new Uri(new Uri(_baseUrl), src).ToString();

                lock (CheckedImages)
                {
                    if (CheckedImages.Contains(imageUrl))
                    {
                        continue;
                    }

                    CheckedImages.Add(imageUrl);
                }

                // Make the HTTP request and check if the link responds correctly
                var response = await httpClient.GetAsync(imageUrl);
                Assert.That((int)response.StatusCode, Is.EqualTo(200), $"{imageUrl} does not exist");
            }
        }
    }

    [TestCase("")]
    [TestCase("contacto")]
    [TestCase("venta-fotografias")]
    [TestCase("galeria-fotos")]
    [TestCase("paisajes-naturaleza")]
    [TestCase("fotografia-nocturna")]
    [TestCase("paisajes-urbanos")]
    [TestCase("retratos-books-moda")]
    [TestCase("reportaje-bodas")]
    [TestCase("conciertos")]
    [TestCase("reportaje-fotos-embarazadas")]
    public async Task VerifyAllLinksWork(string pageUrl)
    {
        await Page.GotoAsync(pageUrl);

        var links = await Page.QuerySelectorAllAsync("a");

        var hrefs = (await Task.WhenAll(links.Select(async link => await link.GetAttributeAsync("href"))))
            .Where(href => !string.IsNullOrEmpty(href))
            .Distinct()
            .ToList();


        using var httpClient = new HttpClient();

        foreach (var href in hrefs)
        {
            if (!string.IsNullOrEmpty(href) &&
                !href.StartsWith('#') &&
                !href.StartsWith("javascript") &&
                !href.StartsWith("mailto"))
            {
                // Ensure the URL is absolute
                var linkUrl = new Uri(new Uri(_baseUrl), href).ToString();

                lock (CheckedLinks)
                {
                    if (CheckedLinks.Contains(linkUrl))
                    {
                        continue;
                    }

                    CheckedLinks.Add(linkUrl);
                }

                var expectedStatusCodes = new List<int>
                {
                    200, // OK
                    202, // Accepted
                };

                if (LinksHttpErrors.TryGetValue(linkUrl, out int statusCode))
                {
                    expectedStatusCodes.Add(statusCode);
                }

                try
                {
                    // Make the HTTP request and check if the link responds correctly
                    var response = await httpClient.GetAsync(linkUrl);

                    Assert.That(
                        expectedStatusCodes,
                        Does.Contain((int)response.StatusCode),
                        $"{linkUrl} is broken (Status code: {response.StatusCode}).");
                }
                catch (Exception ex)
                {
                    Assert.Fail($"{linkUrl} is broken: {ex.Message}");
                }
            }
        }
    }

    [TestCase("")]
    [TestCase("contacto")]
    [TestCase("venta-fotografias")]
    [TestCase("galeria-fotos")]
    [TestCase("paisajes-naturaleza")]
    [TestCase("fotografia-nocturna")]
    [TestCase("paisajes-urbanos")]
    [TestCase("retratos-books-moda")]
    [TestCase("reportaje-bodas")]
    [TestCase("conciertos")]
    [TestCase("reportaje-fotos-embarazadas")]
    public async Task VerifyAllMetaImagesExist(string pageUrl)
    {
        await Page.GotoAsync(pageUrl);

        var metaImages = await Page.QuerySelectorAllAsync("meta[name='image'], meta[itemprop='image'], meta[name='twitter:image'], meta[property='og:image']");

        var srcs = (await Task.WhenAll(metaImages.Select(async meta => await meta.GetAttributeAsync("content"))))
            .Where(content => !string.IsNullOrEmpty(content))
            .Distinct()
            .ToList();

        using var httpClient = new HttpClient();

        foreach (var src in srcs)
        {
            if (!string.IsNullOrEmpty(src))
            {
                // Ensure the URL is absolute
                var imageUrl = new Uri(new Uri(_baseUrl), src).ToString();

                lock (CheckedImages)
                {
                    if (CheckedImages.Contains(imageUrl))
                    {
                        continue;
                    }

                    CheckedImages.Add(imageUrl);
                }

                // Make the HTTP request and check if the link responds correctly
                var response = await httpClient.GetAsync(imageUrl);
                Assert.That((int)response.StatusCode, Is.EqualTo(200), $"{imageUrl} does not exist");
            }
        }
    }

    [TestCase("")]
    [TestCase("contacto")]
    [TestCase("venta-fotografias")]
    [TestCase("galeria-fotos")]
    [TestCase("paisajes-naturaleza")]
    [TestCase("fotografia-nocturna")]
    [TestCase("paisajes-urbanos")]
    [TestCase("retratos-books-moda")]
    [TestCase("reportaje-bodas")]
    [TestCase("conciertos")]
    [TestCase("reportaje-fotos-embarazadas")]
    public async Task VerifyAllCssAndJsFilesExist(string pageUrl)
    {
        await Page.GotoAsync(pageUrl);

        var cssFiles = await Page.QuerySelectorAllAsync("link[rel='stylesheet']");
        var jsFiles = await Page.QuerySelectorAllAsync("script[src]");

        var cssSrcs = (await Task.WhenAll(cssFiles.Select(async link => await link.GetAttributeAsync("href"))))
            .Where(href => !string.IsNullOrEmpty(href))
            .Distinct()
            .ToList();

        var jsSrcs = (await Task.WhenAll(jsFiles.Select(async script => await script.GetAttributeAsync("src"))))
            .Where(src => !string.IsNullOrEmpty(src))
            .Distinct()
            .ToList();

        using var httpClient = new HttpClient();

        foreach (var src in cssSrcs.Concat(jsSrcs))
        {
            if (!string.IsNullOrEmpty(src))
            {
                // Ensure the URL is absolute
                var fileUrl = new Uri(new Uri(_baseUrl), src).ToString();

                lock (CheckedCssAndJs)
                {
                    if (CheckedCssAndJs.Contains(fileUrl))
                    {
                        continue;
                    }

                    CheckedCssAndJs.Add(fileUrl);
                }

                var expectedStatusCodes = new List<int>
                {
                    200, // OK
                    202, // Accepted, 
                    204  // No Content
                };

                // Make the HTTP request and check if the file responds correctly
                var response = await httpClient.GetAsync(fileUrl);

                Assert.That(
                        expectedStatusCodes,
                        Does.Contain((int)response.StatusCode),
                        $"{fileUrl} is broken (Status code: {response.StatusCode}).");
            }
        }
    }

    public override BrowserNewContextOptions ContextOptions()
    {
        _baseUrl = TestContext.Parameters["BaseUrl"] ?? string.Empty;

        return new BrowserNewContextOptions()
        {
            BaseURL = _baseUrl
        };
    }
}
