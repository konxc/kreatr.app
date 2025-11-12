# ✅ Next.js 16 & React 19 Upgrade Checklist

## Pre-Upgrade

- [ ] Backup current codebase
- [ ] Commit all changes to git
- [ ] Create new branch: `git checkout -b upgrade/nextjs-16`
- [ ] Review [UPGRADE-TO-NEXTJS16.md](../UPGRADE-TO-NEXTJS16.md)

## Installation

- [ ] Run `./upgrade.sh` or manual installation
- [ ] Verify no installation errors
- [ ] Check `bun.lockb` is generated

## Code Changes

### React 19 Updates
- [ ] Add explicit `children?: React.ReactNode` to components
- [ ] Replace `forwardRef` with regular `ref` prop (if any)
- [ ] Update component prop types

### Next.js 16 Updates
- [ ] Verify Server Actions work (no experimental flag needed)
- [ ] Check image optimization works
- [ ] Test metadata API

### tRPC v11 Updates
- [ ] Verify all tRPC calls work
- [ ] Check type safety is maintained
- [ ] Test API endpoints

## Testing

### Build & Type Check
- [ ] `bun run type-check` passes
- [ ] `bun run lint` passes
- [ ] `bun run build` succeeds
- [ ] No TypeScript errors
- [ ] No ESLint errors

### Development Server
- [ ] `bun run dev` starts successfully
- [ ] No console errors
- [ ] Hot reload works
- [ ] Fast refresh works

### Functionality Testing
- [ ] Landing page loads correctly
- [ ] All routes accessible
- [ ] Images load properly
- [ ] Styles render correctly
- [ ] Animations work

### Authentication
- [ ] Login page works
- [ ] Register page works
- [ ] OAuth providers work (if configured)
- [ ] Session management works
- [ ] Protected routes work

### API Testing
- [ ] tRPC endpoints respond
- [ ] Type safety maintained
- [ ] Error handling works
- [ ] Data fetching works

### Database
- [ ] Prisma Client generated
- [ ] Database connections work
- [ ] Queries execute properly
- [ ] Migrations work

## Performance

- [ ] Build time acceptable
- [ ] Page load time good
- [ ] No performance regressions
- [ ] Bundle size reasonable

## Documentation

- [ ] Update README if needed
- [ ] Update CHANGELOG
- [ ] Document any breaking changes
- [ ] Update team on changes

## Deployment

- [ ] Test build in staging
- [ ] Verify environment variables
- [ ] Check CI/CD pipeline
- [ ] Update deployment docs if needed

## Post-Upgrade

- [ ] Monitor for errors
- [ ] Check analytics
- [ ] Gather team feedback
- [ ] Document lessons learned

## Rollback Plan

If issues occur:

```bash
# Rollback to previous version
git checkout main
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -f bun.lockb
bun install
```

## Sign-off

- [ ] Developer tested: _______________
- [ ] QA tested: _______________
- [ ] Product owner approved: _______________
- [ ] Ready for production: _______________

---

**Date Started:** _______________  
**Date Completed:** _______________  
**Issues Found:** _______________  
**Resolution:** _______________

---

## Notes

Add any additional notes or observations here:

```
[Your notes here]
```
