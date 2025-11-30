# n8n Library

**Discover 2,300+ free n8n workflow templates** - A curated collection of automation templates for AI, Telegram, Slack, Google Sheets, and more.

[![Deploy to Cloudflare Pages](https://github.com/7and1/n8n-Library/actions/workflows/deploy.yml/badge.svg)](https://github.com/7and1/n8n-Library/actions/workflows/deploy.yml)

**Live Site**: [https://n8n-library.pages.dev](https://n8n-library.pages.dev)

## Features

- **2,348 Workflow Templates** - Comprehensive collection of ready-to-use n8n automations
- **8 Categories** - AI & Automation, Communication, Productivity, DevOps, CRM & Sales, E-commerce, Data Processing, Utilities
- **200+ Integrations** - Templates for popular services like OpenAI, Telegram, Slack, Google Sheets, Notion, and more
- **Full-Text Search** - Quickly find workflows by name, description, or node type
- **One-Click Copy** - Copy workflow JSON directly to your clipboard
- **Mobile Responsive** - Works great on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Search**: Fuse.js
- **Deployment**: Cloudflare Pages
- **CI/CD**: GitHub Actions

## Data Sources & Credits

This project aggregates workflow templates from two excellent community repositories:

### [awesome-n8n](https://github.com/n8n-io/awesome-n8n)
Official curated list of awesome n8n workflows, maintained by the n8n team and community contributors.

### [n8n-workflows](https://github.com/leonardodev98/n8n-workflows)
Community collection of n8n workflow templates by [@leonardodev98](https://github.com/leonardodev98).

**Thank you to all the contributors** who have shared their workflows with the community!

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
n8n-library/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── page.tsx         # Homepage
│   │   ├── search/          # Search page
│   │   ├── category/        # Category pages
│   │   ├── integration/     # Integration pages
│   │   ├── workflow/        # Workflow detail pages
│   │   └── about/           # About page
│   ├── components/          # React components
│   └── lib/                 # Utilities and data functions
├── public/
│   └── data/                # Pre-built workflow data
│       ├── index.json       # Search index
│       ├── categories.json  # Category metadata
│       ├── integrations.json# Integration summary
│       └── workflows/       # Individual workflow JSON files
└── scripts/                 # ETL build scripts
```

## License

MIT

## Disclaimer

This is an unofficial community project and is not affiliated with n8n GmbH. n8n is a registered trademark of n8n GmbH. All workflow templates are provided by the community under their respective licenses.
