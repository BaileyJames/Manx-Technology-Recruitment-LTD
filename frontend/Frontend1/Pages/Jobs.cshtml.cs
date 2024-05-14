using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;


namespace Frontend1.Pages;

public class Jobs : PageModel
{
    public List<(string Id, string Name)> Skills { get; set; }
    public List<JobData> JobListings { get; set; }

    public async Task OnGetAsync()
    {
        string skillUrl = "http://localhost:3000/skills";
        string skillJsonData = await FetchDataAsync(skillUrl);

        if (!string.IsNullOrEmpty(skillJsonData))
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var skillData = JsonSerializer.Deserialize<List<SkillData>>(skillJsonData, options);

            Skills = new List<(string, string)>();
            foreach (var skill in skillData)
            {
                Skills.Add((skill._id, skill.name));
            }
        }
    }

    public async Task OnPostSearch(string SkillIds)
    {
        System.Diagnostics.Debug.WriteLine(SkillIds);
        string skillUrl = "http://localhost:3000/skills";
        string skillJsonData = await FetchDataAsync(skillUrl);

        if (!string.IsNullOrEmpty(skillJsonData))
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var skillData = JsonSerializer.Deserialize<List<SkillData>>(skillJsonData, options);

            Skills = new List<(string, string)>();
            foreach (var skill in skillData)
            {
                Skills.Add((skill._id, skill.name));
            }
        }

        string jobUrl = "http://localhost:3000/jobs?desiredSkills=" + SkillIds;
        string jobJsonData = await FetchDataAsync(jobUrl);

        if (!string.IsNullOrEmpty(jobJsonData))
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            JobListings = JsonSerializer.Deserialize<List<JobData>>(jobJsonData, options);
        }
        else
        {
            JobListings = new List<JobData>();
        }
    }
    private async Task<string> FetchDataAsync(string url)
    {
        try
        {
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    return null;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error fetching data: " + ex.Message);
            return null;
        }
    }

    public class SkillData
    {
        public string _id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
    }

    public class JobData
    {
        public string _id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string salary { get; set; }
        public string schedule { get; set; }
        public string location { get; set; }
        public string postDate { get; set; }
        public string deadline { get; set; }
        public string[] desiredSkills { get; set; }
        public string companyId { get; set; }
    }
}