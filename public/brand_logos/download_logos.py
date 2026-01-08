#!/usr/bin/env python3
"""
Logo Downloader for Trump Files Database
Extracts URLs from database and downloads transparent PNG logos
"""

import json
import re
from urllib.parse import urlparse
from collections import defaultdict
import subprocess
import os

# Database connection string
DB_CONNECTION = "postgresql://neondb_owner:npg_UtmAiIbTx51q@ep-fancy-queen-aaooa4ag-pooler.westus3.azure.neon.tech/neondb?sslmode=require&channel_binding=require"

def extract_domains_from_json(links_json):
    """Extract domains from entry_links JSON field"""
    domains = set()
    
    if not links_json:
        return domains
    
    try:
        # Parse JSON
        data = json.loads(links_json)
        
        # Handle different JSON structures
        if isinstance(data, dict):
            for key, value in data.items():
                if isinstance(value, str):
                    domains.add(extract_domain(value))
                elif isinstance(value, list):
                    for item in value:
                        if isinstance(item, str):
                            domains.add(extract_domain(item))
        elif isinstance(data, list):
            for item in data:
                if isinstance(item, dict) and 'source_url' in item:
                    if item['source_url']:
                        domains.add(extract_domain(item['source_url']))
    except json.JSONDecodeError:
        pass
    
    return {d for d in domains if d}  # Remove None values

def extract_domain(url):
    """Extract clean domain from URL"""
    if not url or '/' not in url:
        # Handle partial URLs like "youtube.com/video"
        if '.' in url:
            return url.split('/')[0].replace('www.', '')
        return None
    
    try:
        parsed = urlparse(url if url.startswith('http') else f'https://{url}')
        domain = parsed.netloc or parsed.path.split('/')[0]
        return domain.replace('www.', '')
    except:
        return None

def get_brand_name(domain):
    """Convert domain to brand name"""
    # Remove TLD
    name = domain.split('.')[0]
    # Capitalize
    return name.capitalize()

# Sample domains from the data we have
KNOWN_DOMAINS = {
    'youtube.com', 'factcheck.org', 'whitehouse.gov', 'noaa.gov', 'cdc.gov',
    'accesshollywood.com', 'washingtonpost.com', 'innocenceproject.org',
    'nytimes.com', 'aclu.org', 'twitter.com', 'fbi.gov', 'doj.gov',
    'justice.gov', 'nasa.gov', 'poison-control', 'heather-heyer',
    'capitol-security', 'court-documents', 'multiple-sources'
}

# Filter to actual news/media brands
VALID_BRANDS = {
    'youtube.com': 'YouTube',
    'factcheck.org': 'FactCheck.org',
    'whitehouse.gov': 'White House',
    'noaa.gov': 'NOAA',
    'cdc.gov': 'CDC',
    'accesshollywood.com': 'Access Hollywood',
    'washingtonpost.com': 'Washington Post',
    'nytimes.com': 'New York Times',
    'twitter.com': 'Twitter/X',
    'fbi.gov': 'FBI',
    'doj.gov': 'DOJ',
    'justice.gov': 'Justice Department',
    'nasa.gov': 'NASA',
    'aclu.org': 'ACLU',
    'innocenceproject.org': 'Innocence Project',
}

print("Valid brands to download:", len(VALID_BRANDS))
print(json.dumps(VALID_BRANDS, indent=2))
