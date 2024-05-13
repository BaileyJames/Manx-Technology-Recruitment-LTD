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

    public async Task OnGetAsync()
    {
        // Fetch skill data from the target webpage using GET method
        string skillUrl = "http://localhost:3000/skills"; // Replace with the actual URL for skill data
        string skillJsonData = await FetchDataAsync(skillUrl);

        if (!string.IsNullOrEmpty(skillJsonData))
        {
            // Parse skill data
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var skillData = JsonSerializer.Deserialize<List<SkillData>>(skillJsonData, options);

            // Create a list of skill IDs and names
            Skills = new List<(string, string)>();
            foreach (var skill in skillData)
            {
                Skills.Add((skill._id, skill.name));
            }
        }
        else
        {
            // Handle case where JSON data is null or empty
            // Log or display an error message
        }
    }

    // Method to fetch data from the target webpage
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
                    // Handle unsuccessful response
                    return null;
                }
            }
        }
        catch (Exception ex)
        {
            // Handle exception
            // Log or display the error message
            Console.WriteLine("Error fetching data: " + ex.Message);
            return null;
        }
    }

    // Model class representing skill data structure
    private class SkillData
    {
        public string _id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
    }
}