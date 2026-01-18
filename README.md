# NeuroHub

Platform for freelancing in the field of generative AI.

## 📋 Overview

NeuroHub is a specialized freelance marketplace connecting AI specialists with clients who need generative AI services. The platform focuses on modern generative models (GPT-4, Midjourney, Stable Diffusion, DALL-E, etc.) and provides unique features for showcasing AI capabilities.

Key features:

- **Two-sided Marketplace**: Freelancers and clients with role-based workflows
- **Specialization in Generative AI**: Not a universal freelance marketplace
- **Live Demonstrations**: Integration with Hugging Face Spaces for interactive demos
- **Skills Verification**: Portfolio and interactive demos showcase
- **Project Management**: Kanban boards, built-in messenger, time tracking
- **Rating System**: Reviews and ratings for quality assurance

Target scale: 50,000 daily active users, 2,000+ transactions per day.

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript 5.9+ (strict mode)
- **UI Components**: Material UI 7.3+
- **Styling**: Emotion 11+
- **State Management**: Effector 23+

### Backend

- **Runtime**: Node.js 24 LTS
- **API**: Next.js API Routes (RESTful)
- **API Documentation**: OpenAPI 3.0 (Swagger UI)
- **Database**: PostgreSQL 16
- **Query Builder**: Knex.js 3+
- **Authentication**: Better Auth 1+ (cookie-based sessions, OAuth)

### Development Tools

- **Package Manager**: Yarn Classic 1.x
- **Linting**: ESLint 9+ with TypeScript
- **Formatting**: Prettier 3+
- **Testing**: Jest 29+ with Testing Library
- **Containerization**: Docker with Docker Compose

### Key Dependencies

"dependencies": {
  "@emotion/*": "...",        // Стилизация (CSS-in-JS)
  "@mui/material": "...",     // UI компоненты
  "better-auth": "...",       // Аутентификация и авторизация
  "effector": "...",          // State management (reactive)
  "immer": "...",             // Immutable updates helper
  "knex": "...",              // SQL query builder
  "next": "...",              // React framework
  "next-swagger-doc": "...",  // OpenAPI документация
  "pg": "...",                // PostgreSQL драйвер
  "react": "...",             // UI library
  "swagger-ui-react": "...",  // Swagger UI для API docs
  "zod": "..."                // Schema validation
}

## 🚀 Getting Started

### Prerequisites

- Node.js 24+ LTS
- Yarn 1.x
- Docker & Docker Compose (for local database)

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/picasso/neuro-hub.git
    cd neuro-hub
    ```

2. **Install dependencies**

    ```bash
    yarn install
    ```

3. **Set up environment variables**

    ```bash
    cp env.example .env
    ```

    Edit `.env` and configure your environment variables:

    ```env
    NODE_ENV=development
    PORT=3000
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/neurohub
    BETTER_AUTH_SECRET=your-secret-key-here
    BETTER_AUTH_URL=http://localhost:3000
    ```

4. **Start the database**

    ```bash
    docker-compose up -d postgres
    ```

5. **Run database migrations**

    ```bash
    yarn knex migrate:latest
    ```

6. **Start development server**

    ```bash
    yarn dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

### Development

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
```

### Code Quality

```bash
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint errors
yarn lint:ci      # Run ESLint with zero warnings policy
yarn format       # Format code with Prettier
yarn format:check # Check code formatting
yarn type-check   # Run TypeScript compiler check
```

### Testing

```bash
yarn test         # Run tests
yarn test:watch   # Run tests in watch mode
```

### Database

```bash
yarn knex migrate:make <name>    # Create new migration
yarn knex migrate:latest         # Run all migrations
yarn knex migrate:rollback       # Rollback last batch
yarn knex seed:make <name>       # Create seed file
yarn knex seed:run               # Run seed files
```

## 🐳 Docker

### Development with Docker

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f app
```

### Production Build

```bash
docker build -t neuro-hub .
docker run -p 3000:3000 neuro-hub
```

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI Documentation](https://mui.com/material-ui/)
- [Effector Documentation](https://effector.dev/)
- [Better Auth Documentation](https://www.better-auth.com/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
