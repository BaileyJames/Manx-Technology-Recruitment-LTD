using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Frontend1.Pages.Admin.Company;

public class Remove : PageModel
{
    public string JobId { get; set; }
    public string JobTitle { get; set; }
    public string JobDescription { get; set; }

    public void OnGet(string id)
    {
        JobId = id;
    }
}
