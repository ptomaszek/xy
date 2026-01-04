# Project Guidelines for AI Development

## Developer Profile
I am an experienced React web developer with a strong focus on simplicity, maintainability, and performance. I value clean code practices and modern development workflows.

## Core Principles

### 1. Simplicity First
- **Minimal Dependencies**: Use only essential libraries
- **Small Codebase**: Aim for the fewest files and lines of code possible
- **Clear Architecture**: Easy to understand and modify
- **Single Responsibility**: Each component/file has one clear purpose

### 2. Code Quality Standards
- **DRY (Don't Repeat Yourself)**: Eliminate code duplication
- **Readability**: Code should be self-documenting
- **Consistent Patterns**: Use established conventions throughout
- **Type Safety**: Prefer TypeScript for larger projects

### 3. React Development Guidelines
- **Functional Components**: Use modern React patterns
- **Hooks**: Leverage useState, useEffect, useMemo, useCallback
- **Component Composition**: Build complex UIs from simple parts
- **Props Interface**: Clear, typed prop definitions
- **Error Boundaries**: Handle errors gracefully

### 4. Performance & Optimization
- **Bundle Size**: Keep it minimal
- **Lazy Loading**: Load only what's needed
- **Memoization**: Use when performance benefits are clear
- **Virtualization**: For long lists or complex rendering

### 5. Development Workflow
- **Docker First**: All development should work in Docker containers
- **No Local Dependencies**: Avoid requiring local npm/node installations
- **Hot Reload**: Fast development feedback loops
- **Git Workflow**: Clean commit history with meaningful messages

### 6. Testing Strategy
- **Unit Tests**: For complex logic and utilities
- **Integration Tests**: For critical user flows
- **E2E Tests**: For key user journeys (when necessary)
- **Test Coverage**: Focus on business logic, not trivial code

### 7. Deployment & DevOps
- **GitHub Actions**: Automated CI/CD pipelines
- **GitHub Pages**: Simple static site hosting
- **Docker Compose**: Local development environment
- **Environment Variables**: Secure configuration management

## Technology Stack Preferences

### Frontend
- **React 19+** with functional components
- **Vite** for fast builds and development
- **Tailwind CSS** or minimal CSS-in-JS for styling
- **React Router** for client-side routing (when needed)

### Development Tools
- **Docker** for containerization
- **Docker Compose** for local development
- **GitHub Actions** for CI/CD
- **ESLint + Prettier** for code quality

### When to Add Dependencies
Only add external libraries when:
1. The functionality is complex and well-tested libraries exist
2. The dependency significantly reduces development time
3. The bundle size impact is acceptable
4. The library has good maintenance and security track record

## Code Organization

### File Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── hooks/         # Custom React hooks
├── utils/         # Pure utility functions
├── services/      # API calls and external services
└── types/         # TypeScript type definitions
```

### Naming Conventions
- **Components**: PascalCase (e.g., `Button`, `UserProfile`)
- **Files**: kebab-case matching component name
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **CSS Classes**: kebab-case

## Performance Guidelines

### React-Specific
- Avoid inline object/function creation in render
- Use memoization for expensive calculations
- Implement proper key props for lists
- Consider virtualization for long lists

### General Web Performance
- Optimize images and assets
- Minimize HTTP requests
- Use efficient CSS selectors
- Implement proper caching strategies

## Security Considerations
- **Input Validation**: Always validate user input
- **XSS Prevention**: Sanitize user content
- **CSP Headers**: Implement Content Security Policy
- **Environment Variables**: Never commit secrets to repository

## Accessibility (a11y)
- **Semantic HTML**: Use proper HTML elements
- **ARIA Labels**: When semantic HTML isn't enough
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Color Contrast**: Maintain sufficient contrast ratios

## Project-Specific Notes
- This project uses Docker for all development
- GitHub Pages deployment is the target
- Minimal dependencies are preferred
- Hot reload should work in Docker environment
- All changes should be tested in Docker before committing

## AI Development Guidelines
When making changes or adding features:
1. **Start with the simplest solution**
2. **Consider the impact on bundle size**
3. **Maintain consistency with existing patterns**
4. **Test in Docker environment**
5. **Update documentation if needed**
6. **Ensure GitHub Actions workflow still passes**
7. **Always ask before committing or pushing changes**

Remember: **Simple is better than complex. Complex is better than complicated.**
