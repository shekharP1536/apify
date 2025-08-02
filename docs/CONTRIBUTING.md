# Contributing to Apify Web Interface

Thank you for your interest in contributing to the Apify Web Interface! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**

- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
- Node.js version
- API key permissions

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

1. **Clear description** of the enhancement
2. **Use case** - why would this be useful?
3. **Implementation ideas** - if you have any
4. **Mockups or examples** - if applicable

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main` for your feature
3. **Make your changes** following our coding standards
4. **Add tests** if applicable
5. **Update documentation** as needed
6. **Submit a pull request**

## 🛠️ Development Setup

### Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun
- Git
- Apify account with API access

### Local Development

1. **Clone your fork:**

   ```bash
   git clone https://github.com/your-username/apify.git
   cd apify
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Open browser:**
   Visit `http://localhost:3000`

### Code Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (pages)/           # Page components
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   └── ui/               # UI component library
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## 📝 Coding Standards

### TypeScript

- **Use TypeScript** for all new code
- **Strict mode** is enabled
- **Provide proper types** for all functions and components
- **Use interfaces** for object types
- **Avoid `any`** type - use proper typing

```typescript
// Good
interface ActorData {
  id: string;
  name: string;
  description?: string;
}

// Bad
const data: any = fetchActorData();
```

### React Components

- **Use functional components** with hooks
- **Follow naming conventions**: PascalCase for components
- **Use TypeScript interfaces** for props
- **Implement proper error boundaries**

```typescript
// Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Button({ onClick, children, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
```

### API Routes

- **Use proper HTTP methods**
- **Implement error handling**
- **Validate input parameters**
- **Return consistent response formats**

```typescript
// Good
export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-apify-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 }
      );
    }

    // Implementation...
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Styling

- **Use Tailwind CSS** for styling
- **Follow component composition** patterns
- **Use CSS variables** for theming
- **Ensure responsive design**

```typescript
// Good
<div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
  <h3 className="text-lg font-semibold">{title}</h3>
  <Button size="sm">Action</Button>
</div>
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- **Write tests** for new features
- **Update tests** when modifying existing code
- **Use descriptive test names**
- **Test both success and error cases**

```typescript
// Example test
describe("ActorCard", () => {
  it("should display actor information correctly", () => {
    const actor = {
      id: "test/actor",
      name: "test-actor",
      title: "Test Actor",
      description: "A test actor",
    };

    render(<ActorCard actor={actor} />);

    expect(screen.getByText("Test Actor")).toBeInTheDocument();
    expect(screen.getByText("A test actor")).toBeInTheDocument();
  });
});
```

## 📚 Documentation

### Code Documentation

- **Document complex functions** with JSDoc comments
- **Explain non-obvious logic**
- **Include examples** in documentation

```typescript
/**
 * Formats the duration in milliseconds to a human-readable string
 * @param durationMs - Duration in milliseconds
 * @returns Formatted duration string (e.g., "2m 30s")
 */
function formatDuration(durationMs: number): string {
  // Implementation...
}
```

### README Updates

When adding new features, update the relevant documentation:

- **README.md** - Main project documentation
- **API.md** - API documentation
- **Component documentation** - If creating new components

## 🔍 Code Review Process

### Before Submitting

- [ ] **Tests pass** locally
- [ ] **Code follows** style guidelines
- [ ] **Documentation** is updated
- [ ] **No console errors** in browser
- [ ] **Responsive design** works on mobile

### Review Criteria

Reviewers will check for:

1. **Functionality** - Does it work as expected?
2. **Code quality** - Is it maintainable and readable?
3. **Performance** - Any performance implications?
4. **Security** - No security vulnerabilities?
5. **UX** - Good user experience?
6. **Documentation** - Properly documented?

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Version is bumped appropriately
- [ ] Changelog is updated
- [ ] Build works in production

## 🎯 Areas for Contribution

### High Priority

- **Performance optimization** - Bundle size, loading times
- **Accessibility improvements** - ARIA labels, keyboard navigation
- **Error handling** - Better error messages and recovery
- **Testing** - Increase test coverage

### Feature Ideas

- **Actor templates** - Save and reuse common configurations
- **Bulk operations** - Run multiple actors simultaneously
- **Webhooks integration** - Real-time notifications
- **Data export** - Export results in various formats
- **Actor marketplace** - Browse public actors
- **Scheduling** - Schedule actor runs

### Bug Fixes

Check the [Issues](https://github.com/your-repo/issues) page for:

- **Bug reports** labeled with `bug`
- **Good first issues** labeled with `good-first-issue`
- **Help wanted** labeled with `help-wanted`

## 📞 Getting Help

- **Discord**: Join our [community Discord](https://discord.com/invite/apify)
- **GitHub Issues**: Create an issue for questions
- **Email**: Contact the maintainers directly

## 🏆 Recognition

Contributors will be:

- **Listed** in the project's contributors section
- **Mentioned** in release notes for significant contributions
- **Invited** to join the core contributor team (for regular contributors)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Apify Web Interface! 🎉
