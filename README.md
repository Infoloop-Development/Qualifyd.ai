# Qualifyd.ai

Qualifyd.ai is a deterministic resume–job description matching system designed to evaluate candidate fit without relying on opaque AI models. It focuses on practical hiring signals such as skill overlap, experience relevance, ATS compatibility, and resume writing quality.

## What Qualifyd.ai Does

- Compares a resume against a specific job description
- Calculates a role fit score based on skills, experience, and keywords
- Generates an ATS-likelihood score focused on parseability and keyword accuracy
- Detects missing skills, tools, and experience gaps
- Flags spelling, grammar, and resume-style issues
- Suggests concrete improvements for resume bullets and summaries

## Tech Stack

- **Frontend:** React, TailwindCSS
- **Backend:** Node.js, Express
- **Parsing:** pdf-parse, mammoth
- **Spell & Grammar:** nodehun, rule-based checks
- **Queue:** BullMQ / RabbitMQ
- **Storage:** PostgreSQL, S3-compatible storage
- **No LLMs used in v1**

## System Flow

1. User pastes a job description
2. User uploads a resume (PDF or DOCX)
3. Backend parses and structures both inputs
4. Resume and JD are compared using rule-based logic
5. Scores and improvement suggestions are generated
6. Results are returned with highlighted matches and gaps

## Scoring Breakdown

- **Fit Score:** Skill match, required skill coverage, experience relevance
- **ATS Score:** Keyword match, formatting, parseability
- **Writing Score:** Spelling, grammar, bullet quality, readability

All scores are explainable and weight-based.

## Why Qualifyd.ai

Most resume analyzers rely on black-box AI scoring. Qualifyd.ai is built to be:
- Transparent
- Predictable
- Easy to debug and improve
- Suitable for production hiring workflows

## Roadmap

- Inline resume editor
- Resume export (PDF)
- Multi-resume comparison
- Chrome extension for LinkedIn JDs

## License

MIT
