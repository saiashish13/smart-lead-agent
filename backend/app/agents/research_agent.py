import os
from tavily import TavilyClient

def search_profile(query):
    try:
        tavily = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))
        response = tavily.search(query=query, max_results=1)
        results = response.get("results", [])
        if results:
            return results[0]['url']
    except Exception as e:
        print(f"Error searching for {query}: {e}")
    return None

def research_leads(lead):
    name = lead.get("name")
    company = lead.get("company")
    
    if not name or not company:
        return {"error": "Missing name or company for research"}

    linkedin_query = f"site:linkedin.com/in {name} {company}"
    github_query = f"site:github.com {name} {company}"
    
    linkedin_url = search_profile(linkedin_query)
    github_url = search_profile(github_query)
    
    return {
        "linkedin_url": linkedin_url or "Not found",
        "github_url": github_url or "Not found",
        "research_status": "completed"
    }
