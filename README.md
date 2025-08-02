# Apify Web Interface

A modern web interface for managing and running [Apify](https://apify.com) actors with real-time monitoring and result visualization. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🌟 Features

- **🔐 Secure API Key Management** - Store and validate Apify API keys with automatic persistence
- **📋 Actor Discovery** - Browse and search through your available Apify actors
- **⚙️ Dynamic Configuration** - Edit JSON input parameters with syntax highlighting and validation
- **🚀 Real-time Execution** - Run actors with live status monitoring and progress tracking
- **📊 Results Visualization** - View dataset results in interactive tables with data modal
- **💰 Cost Tracking** - Monitor resource usage, compute units, and execution costs
- **🎨 Modern UI** - Clean, responsive interface with dark/light theme support
- **🔄 Auto-retry** - Intelligent retry mechanism for failed runs
- **📱 Mobile Responsive** - Optimized for desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- An active [Apify account](https://apify.com/) with API access

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd apify
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Getting Your Apify API Key

1. Log in to your [Apify Console](https://console.apify.com/)
2. Go to Settings → API tokens
3. Create a new token or copy an existing one
4. The API key should be at least 32 characters long

## 📖 Usage Guide

### 1. API Key Setup

- Enter your Apify API key on the home page
- The key is securely stored in your browser's local storage
- Keys are automatically validated against the Apify API

### 2. Selecting an Actor

- Browse through your available actors in the grid view
- Use the dropdown to select an actor
- View actor details including stats, categories, and pricing

### 3. Configuring Input

- Edit the JSON input in the configuration panel
- Use the "Format JSON" button to beautify your input
- "Reset to Example" restores the actor's default input

### 4. Running Actors

- Click "Run Actor" to start execution
- Monitor real-time status updates
- View resource usage and cost information
- Access logs via the Apify Console link

### 5. Viewing Results

- Successful runs automatically load dataset results
- View results in an interactive table modal
- Export or view complete datasets in Apify Console

## 🏗️ Project Structure

```
├── app/                          # Next.js app directory
│   ├── actor/[id]/              # Dynamic actor pages
│   │   └── page.tsx             # Actor configuration & execution
│   ├── api/                     # API routes
│   │   ├── actors/              # Fetch available actors
│   │   ├── dataset/             # Retrieve dataset results
│   │   ├── run/                 # Start/monitor actor runs
│   │   ├── schema/              # Fetch actor schemas
│   │   └── input-schema/        # Get input schemas
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx           # Button component
│   │   ├── data-modal.tsx       # Results display modal
│   │   ├── dialog.tsx           # Dialog primitives
│   │   ├── input.tsx            # Input component
│   │   ├── table.tsx            # Table component
│   │   └── theme-switcher.tsx   # Dark/light mode toggle
│   └── theme-provider.tsx       # Theme context provider
├── lib/
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

## 🔌 API Integration

### Endpoints Used

The application integrates with these Apify API endpoints:

- `GET /v2/acts` - List available actors
- `GET /v2/acts/{actorId}` - Get actor details and schema
- `POST /v2/acts/{actorId}/runs` - Start actor execution
- `GET /v2/actor-runs/{runId}` - Monitor run status
- `GET /v2/datasets/{datasetId}/items` - Retrieve results

### Rate Limiting

The application respects Apify's rate limits and implements:

- Request queuing for concurrent operations
- Automatic retry with exponential backoff
- Error handling for rate limit responses

## 🎨 Theming

The application supports both light and dark themes:

- **Theme Toggle**: Click the theme switcher in the top navigation
- **System Theme**: Automatically detects your system preference
- **Persistence**: Theme choice is saved in local storage

## 📦 Build & Deployment

### Development Build

```bash
npm run build
npm run start
```

### Production Deployment

#### Deploy on Vercel (Recommended)

1. Connect your repository to [Vercel](https://vercel.com)
2. Deploy with zero configuration
3. Automatic HTTPS and global CDN

#### Other Platforms

- **Netlify**: Add build command `npm run build` and publish directory `out`
- **Docker**: Use the included Next.js optimization for containerization
- **Static Export**: Enable static export in `next.config.ts` if needed

### Environment Variables

No environment variables are required for basic functionality. All configuration is handled client-side through the UI.

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with Next.js recommended rules
- **Prettier**: Code formatting (if configured)

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**Invalid API Key Error**

- Ensure your API key is at least 32 characters
- Check that the key has proper permissions in Apify Console
- Verify the key hasn't expired

**Actor Not Loading**

- Check your internet connection
- Verify the actor exists and is accessible
- Ensure you have permissions to view the actor

**Run Failures**

- Review the input JSON for syntax errors
- Check actor-specific requirements in Apify Console
- Monitor resource limits and quotas

**Results Not Displaying**

- Verify the actor completed successfully
- Check if the actor produces dataset output
- Review browser console for JavaScript errors

### Debug Mode

Enable verbose logging in browser developer tools:

```javascript
localStorage.setItem("debug", "true");
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- **Documentation**: [Apify Documentation](https://docs.apify.com/)
- **Community**: [Apify Discord](https://discord.com/invite/jyEM2PRvMU)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🏆 Acknowledgments

- [Apify](https://apify.com/) for the powerful web scraping and automation platform
- [Vercel](https://vercel.com/) for Next.js and deployment platform
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Lucide](https://lucide.dev/) for beautiful icons

---

Built with ❤️ for the Apify community
