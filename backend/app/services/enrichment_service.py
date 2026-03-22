import os
from tavily import TavilyClient
from openai import OpenAI
from flask import current_app
import json
import re

def enrich_data(lead):
    """
    Enrich lead data by searching for their profiles on GitHub, LinkedIn, and other websites.
    
    Args:
        lead: Dictionary with at least 'name' and 'company' keys
    
    Returns:
        Enriched lead dictionary with additional fields
    """
    name = lead.get('name', '')
    company = lead.get('company', '')
    
    if not name:
        return lead
    
    print(f"Enriching lead: {name} @ {company}")
    
    try:
        # Search for the person's profiles
        enriched_data = search_for_profiles(name, company)
        
        # Merge enriched data with existing lead data
        lead.update(enriched_data)
        
        # Try to find email if not present
        if lead.get('email') == 'placeholder@example.com' or not lead.get('email'):
            email = find_email(name, company, enriched_data)
            if email:
                lead['email'] = email
        
        return lead
        
    except Exception as e:
        print(f"Enrichment error for {name}: {e}")
        return lead


def search_for_profiles(name, company):
    """
    Search for a person's GitHub, LinkedIn, and other professional profiles.
    """
    enriched = {
        'github_url': None,
        'linkedin_url': None,
        'twitter_url': None,
        'personal_website': None,
        'industry': None
    }
    
    try:
        tavily_client = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))
        
        # Search for GitHub profile
        github_query = f"{name} {company} site:github.com"
        response = tavily_client.search(query=github_query, max_results=3)
        github_results = response.get("results", [])
        
        for result in github_results:
            url = result.get('url', '')
            if 'github.com/' in url and '/github.com/' in url:
                enriched['github_url'] = url
                break
        
        # Search for LinkedIn profile
        linkedin_query = f"{name} {company} site:linkedin.com/in"
        response = tavily_client.search(query=linkedin_query, max_results=3)
        linkedin_results = response.get("results", [])
        
        for result in linkedin_results:
            url = result.get('url', '')
            if 'linkedin.com/in/' in url:
                enriched['linkedin_url'] = url
                break
        
        # Search for Twitter/X profile
        twitter_query = f"{name} {company} site:twitter.com OR site:x.com"
        response = tavily_client.search(query=twitter_query, max_results=3)
        twitter_results = response.get("results", [])
        
        for result in twitter_results:
            url = result.get('url', '')
            if 'twitter.com/' in url or 'x.com/' in url:
                enriched['twitter_url'] = url
                break
        
        # General search for personal website or blog
        general_query = f"{name} {company} developer blog portfolio"
        response = tavily_client.search(query=general_query, max_results=5)
        general_results = response.get("results", [])
        
        for result in general_results:
            url = result.get('url', '')
            # Skip social media and common platforms
            if not any(domain in url for domain in ['linkedin.com', 'github.com', 'twitter.com', 'facebook.com', 'instagram.com']):
                if any(keyword in url.lower() for keyword in [name.lower().replace(' ', ''), 'blog', 'portfolio', 'personal']):
                    enriched['personal_website'] = url
                    break
        
        # Determine industry from company or search results
        enriched['industry'] = determine_industry(company, general_results)
        
        print(f"Found profiles: GitHub={bool(enriched['github_url'])}, LinkedIn={bool(enriched['linkedin_url'])}")
        
    except Exception as e:
        print(f"Profile search error: {e}")
    
    return enriched


def find_email(name, company, enriched_data):
    """
    Attempt to find or construct an email address for the lead.
    """
    try:
        # Try common email patterns
        if company:
            # Clean company name
            company_clean = re.sub(r'[^a-zA-Z0-9]', '', company.lower())
            name_parts = name.lower().split()
            
            if len(name_parts) >= 2:
                first = name_parts[0]
                last = name_parts[-1]
                
                # Common email patterns
                patterns = [
                    f"{first}.{last}@{company_clean}.com",
                    f"{first}@{company_clean}.com",
                    f"{first[0]}{last}@{company_clean}.com",
                    f"{first}{last}@{company_clean}.com"
                ]
                
                # Return the first pattern (most common)
                return patterns[0]
        
        # If we found a GitHub profile, try to extract email from it
        if enriched_data.get('github_url'):
            # This would require scraping, so we'll skip for now
            pass
        
    except Exception as e:
        print(f"Email finding error: {e}")
    
    return None


def determine_industry(company, search_results):
    """
    Determine the industry based on company name and search results.
    """
    # Common tech keywords
    tech_keywords = ['software', 'tech', 'developer', 'engineering', 'cloud', 'ai', 'data', 'digital']
    finance_keywords = ['bank', 'financial', 'fintech', 'investment', 'capital']
    healthcare_keywords = ['health', 'medical', 'pharma', 'biotech', 'hospital']
    
    company_lower = company.lower() if company else ''
    
    # Check company name
    if any(keyword in company_lower for keyword in tech_keywords):
        return 'Technology'
    elif any(keyword in company_lower for keyword in finance_keywords):
        return 'Finance'
    elif any(keyword in company_lower for keyword in healthcare_keywords):
        return 'Healthcare'
    
    # Check search results
    results_text = ' '.join([r.get('content', '') for r in search_results[:3]]).lower()
    
    if any(keyword in results_text for keyword in tech_keywords):
        return 'Technology'
    elif any(keyword in results_text for keyword in finance_keywords):
        return 'Finance'
    elif any(keyword in results_text for keyword in healthcare_keywords):
        return 'Healthcare'
    
    return 'Other'
