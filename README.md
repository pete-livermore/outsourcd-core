# Outsourcd

Outsourcd is a web application that allows users to search, view, and apply for jobs.
This repo contains the code for the backend of the application. Built using NestJS, it was built to handle the management of data underpinning users, job listings, and applications.

## Features

- User, Job and Company management (entity CRUD)
- Media file creation and upload integration with Cloudinary
- Integration with Sengrid for emailing functionality
- JWT-based authentication
- Caching
- Message queue functionality

## Tech

- NestJS
- TypeScript
- PostgreSQL
- Redis
- Bull
- Docker

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Docker (optional) or PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/outsourcd-app.git
cd outsourcd
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a .env file in the root directory and add the following variables:

```bash
API_VERSION=your_api_version
CACHE_TTL=your_cache_ttl
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=your_jwt_expiry_time
MAX_UPLOAD_FILE_SIZE=your_max_upload_size (bytes)
OPEN_API_DESCRIPTION=your_api_description
OPEN_API_TITLE=your_api_title
PASSWORD_SALT_ROUNDS=number_of_salt_rounds
POSTGRES_HOST=your_database_host (localhost for local dev)
POSTGRES_PORT=your_database_port
POSTGRES_USER=your_database_user
POSTGRES_PASSWORD=your_database_password
POSTGRES_DB=your_database_name
REDIS_HOST=your_database_host (localhost for local dev)
REDIS_CACHE_PORT=your_redis_port
REDIS_QUEUE_PORT=another_redis_port
```

4. Set up the infrastructure:

_Option 1 (containers):_

- Make sure the Docker daemon is running

```bash
npm run infrastructure:up
# or
yarn infrastructure:up
```

_Option 2_

- Create a local Postgres instance
- Run 2 local Redis instances
- Ensure that the ports match those in the environment variables

5. Run the database migrations:

```bash
npm run db:migrate
# or
yarn db:migrate
```

6. Introspect the DB to get types:

- Run the script to generate the DATABASE_URL environment variable:

```bash
npm run db:build-url
# or
yarn db:build-url
```

- Pull the types from the DB:

```bash
npm run db:pull
# or
yarn db:pull
```

## Running the Application

Start the NestJS server:

```bash
npm run start:dev
# or
yarn start:dev
```

The application will be running on http://localhost:3333. If you wish to change the port, simply populate the `APP_PORT` environment variable with your chosen port.

API Documentation
Outsourcd uses Swagger for API documentation. Once the server is running, you can access the documentation at http://localhost:3000/api.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
