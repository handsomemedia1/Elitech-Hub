# Elitech Hub Upgrade: Walkthrough

## 1. Database Schema
Created `scratch/migration_phase1.sql` with additive migrations extending `research` to support authors, ORCID, publication statuses, research types, and built `web_case_studies` for the Web Development pillar.

## 2. Researcher Dashboard
Built a complete portal under `/researcher`:
- **Overview:** Top-level metrics for submissions and views.
- **Submit Paper:** A complex form capturing academic metadata (Abstract, Authors, ORCID, publication rights, research type).
- **My Research:** Tracking of submission workflows (Draft, Submitted, Under Review, Published).

## 3. Admin Review Workflow
Upgraded the `/admin/lab` portal to handle manuscript approvals:
- Allows filtering by review status.
- Allows admins to accept, reject, or request revisions for submissions.

## 4. Web Development Case Studies
- Built a scalable dynamic route at `/portfolio/[slug]` designed for semantic SEO case studies.
- Updated the main `/portfolio` page to direct users to detailed internal case studies.

## 5. Scholarly SEO
- Ensured Google Scholar specific HTML tags (`citation_title`, `citation_pdf_url`, `citation_author`) are generated server-side for all accepted research papers.
- Verified Citation Export (APA, MLA, Chicago, BibTeX).

## Build Status
Running `npm run build` to verify Next.js static generation and typing.
