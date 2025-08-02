# Changelog

All notable changes to the Apify Web Interface will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive documentation system
- Component library documentation
- API documentation
- Deployment guide
- Contributing guidelines

### Changed

- Updated README with detailed project information
- Enhanced error handling and user feedback

### Security

- Improved API key validation and storage

## [0.1.0] - 2024-01-01

### Added

- Initial release of Apify Web Interface
- API key management and validation
- Actor discovery and browsing
- Dynamic actor configuration with JSON input
- Real-time actor execution monitoring
- Dataset results visualization
- Cost and resource usage tracking
- Dark/light theme support
- Responsive mobile design
- Modern UI with Tailwind CSS and Radix UI

### Features

- **Authentication**: Secure API key storage and validation
- **Actor Management**: Browse, select, and configure Apify actors
- **Execution Engine**: Start and monitor actor runs in real-time
- **Results Display**: Interactive table view for dataset results
- **Resource Monitoring**: Track compute units, memory usage, and costs
- **Theme System**: Toggle between light and dark modes
- **Error Handling**: Comprehensive error messages and retry mechanisms

### Technical Stack

- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Radix UI for accessible components
- Sonner for notifications
- Lucide React for icons

### API Endpoints

- `/api/actors` - List available actors
- `/api/schema` - Get actor details and schema
- `/api/run` - Start and monitor actor runs
- `/api/dataset` - Retrieve dataset results
- `/api/input-schema` - Get actor input schemas

### UI Components

- Button component with multiple variants
- Input component with proper validation
- Dialog system for modals
- Data modal for results display
- Table component for structured data
- Theme switcher for dark/light mode
- Loading spinners and progress indicators

### Pages

- **Home Page**: API key validation and actor selection
- **Actor Page**: Actor configuration and execution interface

### Developer Experience

- TypeScript strict mode enabled
- ESLint configuration for code quality
- Component-based architecture
- Utility functions for common operations
- Responsive design patterns

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Release Notes Template

When creating new releases, use this template:

```markdown
## [Version] - YYYY-MM-DD

### Added

- New features and functionality

### Changed

- Changes to existing functionality

### Deprecated

- Features that will be removed in future versions

### Removed

- Features removed in this version

### Fixed

- Bug fixes

### Security

- Security improvements and fixes
```

## Version Numbering

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version when you make incompatible API changes
- **MINOR** version when you add functionality in a backwards compatible manner
- **PATCH** version when you make backwards compatible bug fixes

### Examples:

- `1.0.0` - Initial stable release
- `1.1.0` - Added new features (backwards compatible)
- `1.1.1` - Bug fixes (backwards compatible)
- `2.0.0` - Breaking changes (not backwards compatible)

## Release Process

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with new version and changes
3. **Create Git tag** with version number
4. **Push changes** and tag to repository
5. **Create GitHub release** with release notes
6. **Deploy to production** platform (Vercel, etc.)

## Migration Guides

### From 0.x to 1.0

_No breaking changes expected for 1.0 release_

Future migration guides will be added here as needed.
