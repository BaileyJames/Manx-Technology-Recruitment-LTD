using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Frontend1.Pages.Admin.Jobs
{
    public class Remove : PageModel
    {
        [BindProperty] public string JobId { get; set; }

        [BindProperty] public string JobTitle { get; set; }

        [BindProperty] public string JobDescription { get; set; }

        [BindProperty] public string JobSchedule { get; set; }

        [BindProperty] public string JobLocation { get; set; }

        [BindProperty] public string JobPostDate { get; set; }

        [BindProperty] public string JobSalary { get; set; }

        [BindProperty] public string JobDeadline { get; set; }

        [BindProperty] public string JobDesiredSkills { get; set; }

        [BindProperty] public string JobIndustry { get; set; }

    }
}