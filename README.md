# ScrapperAI

A modern web scraping application built with Next.js 14, TypeScript, and AI capabilities.

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com)
- **Database:** [Neon](https://neon.tech) (Serverless Postgres)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Vector Storage:** [pgvector](https://github.com/pgvector/pgvector)
- **Authentication:** [Next Auth](https://next-auth.js.org)
- **Deployment:** [Vercel](https://vercel.com)

## Key Features

- 🎨 Modern UI with Shadcn components
- 🌓 Dark mode support
- 🔍 Advanced web scraping capabilities
- 📊 Vector-based data storage
- 🔒 Secure API endpoints
- 🚀 Server-side rendering
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database (with pgvector extension)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/IdrisKulubi/scrapperai.git
cd scrapperai
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
# Database
DATABASE_URL="postgres://..."

# Auth (if using)
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Add other environment variables as needed
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
scrapperai/
├── app/                   # Next.js app router files
├── components/           # React components
│   ├── ui/              # Shadcn UI components
│   └── theme/           # Theme components
├── db/                  # Database configuration and schema
├── lib/                 # Utility functions and shared logic
│   └── scrapers/       # Scraping logic
└── public/             # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
