# Hetafu Next

Hetafu Next is a **Next.js 16** web application built using the App Router. This guide explains how to clone the repository, install dependencies, configure environment variables, run the application locally, and build it for production.

---

# Tech Stack

- Next.js 16
- React
- JavaScript
- App Router
- Turbopack
- Tailwind CSS (if configured)

---

# Prerequisites

Before getting started, ensure the following are installed:

- Node.js 20.x or later (Recommended LTS)
- npm (comes with Node.js)
- Git

Verify your installation:

```bash
node -v
npm -v
git --version
```

---

# Clone the Repository

Clone the project from GitHub:

```bash
git clone https://github.com/hetafu-dev/Hetafu-Next.git
```

Navigate into the project directory:

```bash
cd Hetafu-Next
```

---

# Install Dependencies

Install all required packages:

```bash
npm install
```

Example output:

```text
added 353 packages
audited 354 packages
```

> **Note**
>
> During installation you may see:
>
> - npm audit warnings
> - allow-scripts warnings for `sharp`
> - allow-scripts warnings for `unrs-resolver`
>
> These warnings are normal and do not prevent the application from running.

---

# Environment Setup

After installing dependencies, create your environment file.

### Windows (Command Prompt)

```cmd
copy .env.example .env
```

### Windows (PowerShell)

```powershell
Copy-Item .env.example .env
```

### Linux / macOS

```bash
cp .env.example .env
```

Update the `.env` file with your environment-specific values.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=30000
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API Base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_API_TIMEOUT` | API timeout in milliseconds | `30000` |

---

# Run the Development Server

Start the application:

```bash
npm run dev
```

You should see output similar to:

```text
▲ Next.js 16.x.x (Turbopack)

Local:   http://localhost:3000
Network: http://172.xxx.xxx.xxx:3000

✓ Ready
```

Open your browser and visit:

```
http://localhost:3000
```

The application automatically reloads whenever you save changes.

---

# Project Structure

```
Hetafu-Next/
│
├── app/
├── components/
├── public/
├── lib/
├── hooks/
├── styles/
├── utils/
├── .env.example
├── package.json
├── next.config.js
└── README.md
```

---

# Available Scripts

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Run Lint

```bash
npm run lint
```

---

# Production Build

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

# Troubleshooting

## Port 3000 Already in Use

Run the application on another port:

```bash
npm run dev -- -p 3001
```

Then open:

```
http://localhost:3001
```

---

## npm Audit Warnings

View vulnerabilities:

```bash
npm audit
```

Automatically fix issues:

```bash
npm audit fix
```

Force fix (may introduce breaking changes):

```bash
npm audit fix --force
```

---

## Deprecation Warning

You may see:

```text
[DEP0205] module.register() is deprecated
```

This is a Node.js dependency warning and does not affect the application's functionality.

---

## Next.js Image Warnings

Warnings such as:

```text
Image has "fill" prop and "sizes" prop...
```

or

```text
Image width or height modified...
```

are optimization recommendations from Next.js and do not prevent the application from running.

---

# Development Workflow

1. Clone the repository.
2. Navigate to the project folder.
3. Install dependencies using `npm install`.
4. Create the `.env` file from `.env.example`.
5. Update environment variables.
6. Run the application using `npm run dev`.
7. Open the application in your browser.
8. Make changes and verify locally.
9. Build the application using `npm run build` before deployment.

---

# Repository

GitHub Repository:

https://github.com/hetafu-dev/Hetafu-Next

---

# License

This project is intended for internal development and maintenance by the Hetafu development team.
