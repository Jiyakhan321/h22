# Performance Optimization Skill

## Purpose
Optimize frontend and backend performance

## When to Use
- Slow page loads
- API response time > 200ms
- Large bundle size
- Unnecessary re-renders

## Capabilities
- Code splitting
- React memoization
- Database query optimization
- Connection pooling
- Bundle size reduction

## Target Metrics
- FCP < 1.5s
- API < 200ms (p95)
- Bundle < 250KB

## Optimizations
```typescript
// Frontend
- dynamic imports
- React.memo
- useCallback
- Virtual scrolling

// Backend
- Query pagination
- Connection pooling
- Response caching
```

## Usage
```
Use @performance skill to optimize application speed
```

## Commands
- "Optimize bundle size"
- "Improve API response time"
- "Add code splitting"
