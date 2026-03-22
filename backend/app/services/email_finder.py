"""
Email Finder Service
Generates intelligent email patterns based on name and company information
"""
import re
from typing import List, Dict

def clean_company_name(company: str) -> str:
    """Extract clean company name for domain generation"""
    # Remove common suffixes
    company = re.sub(r'\s+(Inc|LLC|Ltd|Corporation|Corp|Co|Company|GmbH|AG)\.?$', '', company, flags=re.IGNORECASE)
    # Remove special characters
    company = re.sub(r'[^a-zA-Z0-9\s]', '', company)
    # Convert to lowercase and remove spaces
    company = company.lower().strip().replace(' ', '')
    return company

def generate_domain_variations(company: str) -> List[str]:
    """Generate possible domain variations for a company"""
    clean = clean_company_name(company)
    domains = [
        f"{clean}.com",
        f"{clean}.io",
        f"{clean}.co",
        f"{clean}.ai",
        f"{clean}.tech",
    ]
    return domains

def generate_email_patterns(first_name: str, last_name: str, company: str) -> List[str]:
    """
    Generate common email patterns based on name and company
    Returns list of possible emails in order of likelihood
    """
    first = first_name.lower().strip()
    last = last_name.lower().strip()
    
    # Get domain variations
    domains = generate_domain_variations(company)
    
    emails = []
    
    # Common patterns for each domain
    for domain in domains:
        patterns = [
            f"{first}.{last}@{domain}",           # john.doe@company.com (most common)
            f"{first}@{domain}",                   # john@company.com
            f"{first[0]}{last}@{domain}",         # jdoe@company.com
            f"{first}_{last}@{domain}",           # john_doe@company.com
            f"{last}.{first}@{domain}",           # doe.john@company.com
            f"{first}{last}@{domain}",            # johndoe@company.com
        ]
        emails.extend(patterns)
    
    return emails

def find_best_email(name: str, company: str) -> str:
    """
    Find the most likely email for a person
    Returns the first (most common) pattern
    """
    # Parse name
    parts = name.strip().split()
    if len(parts) >= 2:
        first_name = parts[0]
        last_name = parts[-1]
    else:
        # Single name, use it as first name
        first_name = parts[0] if parts else "contact"
        last_name = ""
    
    patterns = generate_email_patterns(first_name, last_name, company)
    return patterns[0] if patterns else f"contact@{clean_company_name(company)}.com"

def extract_email_from_text(text: str) -> str:
    """Extract email address from text if present"""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None
