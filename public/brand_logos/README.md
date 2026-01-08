# Brand Logo Library

**Generated:** October 27, 2025  
**Total Logos:** 15  
**Format:** PNG (128x128px)  
**Source:** Clearbit Logo API

---

## Logo Files

| File | Brand | Domain | Category |
|------|-------|--------|----------|
| `youtube.png` | YouTube | youtube.com | Social Media / Video Platform |
| `factcheck.png` | FactCheck.org | factcheck.org | Fact-Checking Organization |
| `whitehouse.png` | White House | whitehouse.gov | Government / Executive Branch |
| `noaa.png` | NOAA | noaa.gov | Government / Weather Service |
| `cdc.png` | CDC | cdc.gov | Government / Public Health |
| `washingtonpost.png` | Washington Post | washingtonpost.com | News Media / Newspaper |
| `nytimes.png` | New York Times | nytimes.com | News Media / Newspaper |
| `twitter.png` | Twitter / X | twitter.com | Social Media |
| `aclu.png` | ACLU | aclu.org | Civil Rights Organization |
| `innocenceproject.png` | Innocence Project | innocenceproject.org | Legal Advocacy |
| `fbi.png` | FBI | fbi.gov | Government / Law Enforcement |
| `doj.png` | Department of Justice | justice.gov | Government / Legal |
| `nasa.png` | NASA | nasa.gov | Government / Space Agency |
| `accesshollywood.png` | Access Hollywood | accesshollywood.com | Entertainment Media |

---

## Brand Details

### News & Media Organizations

#### **Washington Post** (`washingtonpost.png`)
- **Usage:** Investigative reporting, transcripts, breaking news
- **Example Entries:** #25, #42 (Access Hollywood tape coverage)

#### **New York Times** (`nytimes.png`)
- **Usage:** Original reporting, newspaper ads (Central Park Five)
- **Example Entries:** #26

#### **Access Hollywood** (`accesshollywood.png`)
- **Usage:** Access Hollywood tape, celebrity interviews
- **Example Entries:** #25, #42, #99, #138

### Government Agencies

#### **White House** (`whitehouse.png`)
- **Usage:** Official statements, press conferences, executive orders
- **Example Entries:** #22, #23, #24, #27, #28, #29
- **Most referenced domain:** ~50+ occurrences

#### **CDC** (`cdc.png`)
- **Usage:** COVID-19 data, poisoning statistics, health guidance
- **Example Entries:** #23, #40, #44, #64, #88, #124, #131
- **Frequently cited:** ~15+ entries

#### **FBI** (`fbi.png`)
- **Usage:** Search warrants, investigations, crime statistics
- **Example Entries:** #31, #36, #47, #113 (Mar-a-Lago documents)

#### **Department of Justice** (`doj.png`)
- **Usage:** Indictments, legal documents, prosecutions
- **Example Entries:** #1 (Housing discrimination), #31, #35, #109

#### **NASA** (`nasa.png`)
- **Usage:** Eclipse safety warnings, scientific information
- **Example Entries:** #38, #58, #90 (Eclipse incidents)

#### **NOAA** (`noaa.png`)
- **Usage:** Hurricane data, Sharpie-gate corrections
- **Example Entries:** #22, #45 (Hurricane Dorian)

### Social Media Platforms

#### **Twitter / X** (`twitter.png`)
- **Usage:** Trump tweets, social media posts, conspiracy theories
- **Example Entries:** #28, #37 (Covfefe), #41, #47, #52 (Stable Genius), #72, #75, #76, #79 (Hamberders)
- **Highly referenced:** ~40+ tweet-related entries

#### **YouTube** (`youtube.png`)
- **Usage:** Video evidence, speeches, rally footage
- **Example Entries:** #21, #22, #23, #24
- **Frequently cited:** ~30+ video sources

### Advocacy & Legal Organizations

#### **ACLU** (`aclu.png`)
- **Usage:** Legal challenges, civil rights documentation
- **Example Entries:** #27 (Muslim Ban legal challenges)

#### **Innocence Project** (`innocenceproject.png`)
- **Usage:** Central Park Five exoneration, wrongful convictions
- **Example Entries:** #26, #102

#### **FactCheck.org** (`factcheck.png`)
- **Usage:** Debunking false claims, verification
- **Example Entries:** #21 (Windmill cancer debunking)

---

## Usage Statistics

**Most Referenced Domains:**
1. White House (whitehouse.gov) - ~50+ entries
2. Twitter (twitter.com) - ~40+ entries  
3. YouTube (youtube.com) - ~30+ entries
4. CDC (cdc.gov) - ~15+ entries

---

## Technical Notes

### Image Specifications
- **Resolution:** 128x128 pixels (square)
- **Format:** PNG
- **Color Mode:** RGB (not RGBA)
- **Transparency:** Limited (Clearbit API limitation)

### Converting to True Transparency
Clearbit API provides RGB PNGs without alpha channel. To convert to true transparent PNGs:

```bash
# Using ImageMagick
convert input.png -background none -alpha on output.png

# Batch convert all logos
for file in *.png; do
  convert "$file" -background none -alpha on "transparent_$file"
done
```

### Scaling for Web Use
Logos are 128x128px. Scale down for web display:

```css
/* CSS */
.brand-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}
```

```jsx
// React/Next.js
<Image 
  src="/brand_logos/youtube.png" 
  alt="YouTube" 
  width={80} 
  height={80}
/>
```

---

## Missing/Generic Sources

Some database references don't have actual website logos:
- `heather-heyer-memorial` - Not a domain
- `court-documents` - Generic placeholder
- `multiple-sources` - Generic placeholder
- `capitol-security-footage` - Archive footage, not a brand

**Recommendation:** Use generic fallback icons:
- 📄 Court document icon
- 🏛️ Government building icon
- 📰 Generic news icon
- 🎬 Video/footage icon

---

## Integration Example

```jsx
// Next.js component example
import Image from 'next/image'

const brandLogos = {
  'youtube.com': '/brand_logos/youtube.png',
  'twitter.com': '/brand_logos/twitter.png',
  'washingtonpost.com': '/brand_logos/washingtonpost.png',
  // ... etc
}

export function SourceBadge({ domain }) {
  const logoPath = brandLogos[domain]
  
  if (!logoPath) return null
  
  return (
    <div className="inline-flex items-center gap-2">
      <Image 
        src={logoPath} 
        alt={domain} 
        width={20} 
        height={20}
        className="rounded"
      />
      <span className="text-sm text-gray-600">{domain}</span>
    </div>
  )
}
```

---

## Data Structure

For detailed brand mapping with entry relationships, see `LOGO_MAPPING.json`.

The JSON file includes:
- Entry number associations
- Usage context
- Category classifications
- Metadata and sourcing info

---

## Next Steps

### Task 2: Entry Representative Photos
To download representative photos for each of the ~750 entries:

**Options:**
1. **Google Images API** - $5 per 1000 searches (~$3.75 for 750)
2. **Manual curation** - Download high-priority entries first
3. **Hybrid approach** - AI-assisted search + manual selection

**Recommendation:** Start with top 100 highest composite score entries, then expand based on needs/budget.

---

*Generated from Neon database URL extraction*  
*All logos © their respective owners*
