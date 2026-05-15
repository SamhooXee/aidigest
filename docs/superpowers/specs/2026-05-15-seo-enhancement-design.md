---
name: seo-enhancement
description: Basic SEO enhancement for AI Digest site using Next.js built-in Metadata API
metadata:
  type: project
---

# SEO Enhancement Design

## Overview

Add basic SEO (Open Graph, Twitter Card, robots.txt, sitemap.xml, dynamic page metadata) to the AI Digest Next.js site using built-in Metadata API. Zero external dependencies.

## Changes

### 1. Root Layout — Enhanced Metadata

**File:** `src/app/layout.tsx`

- Add `metadataBase` for absolute URL generation
- Complete `metadata` object with:
  - `title` template for consistent page titles
  - `description` with detailed site description
  - `openGraph`: site name, locale, type
  - `twitter`: card type (summary_large_image), site handle

### 2. Homepage — Dynamic Metadata

**File:** `src/app/page.tsx`

- Add `generateMetadata` function
- Title: "AI 博客每日精选"
- Description: extracted from the latest digest's highlights section
- URL: site root

### 3. Digest Page — Per-Article Metadata

**File:** `src/app/digest/[slug]/page.tsx`

- Add `generateMetadata` async function
- Read markdown file, parse frontmatter
- Extract title, date, description from content (first 160 chars of 今日看点)
- Generate OG and Twitter metadata per article

### 4. robots.txt

**File:** `src/app/robots.ts` (new)

- Allow all crawlers, all paths
- Specify sitemap URL

### 5. sitemap.xml

**File:** `src/app/sitemap.ts` (new)

- Scan `content/` directory for all `.md` files
- Generate sitemap entries for:
  - Home page (`/`)
  - Each digest (`/digest/<slug>`)
- Sort by date descending

## Data Flow

```
content/*.md ──┬── sitemap.ts ──→ /sitemap.xml
               ├── page.tsx ──→ generateMetadata ──→ Homepage OG/Twitter
               └── digest/[slug]/page.tsx ──→ generateMetadata ──→ Article OG/Twitter

robots.ts ──→ /robots.txt (static, references sitemap)
layout.tsx ──→ Default metadata for all pages
```

## Dependencies

No new dependencies. All features use Next.js built-in Metadata API (available since Next.js 13, we use Next.js 16).
