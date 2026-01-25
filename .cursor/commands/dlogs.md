# Check Logs for Errors

## Overview
Check frontend and backend logs for errors after implementing changes or during debugging.

## Steps

1. **Check Browser Console**
   - Open DevTools Console
   - Look for errors (red messages)
   - Check for warnings (yellow messages)
   - Look for React hydration errors
   - Check Network tab for failed requests

2. **Check Server Logs**
   - Terminal running `yarn dev`
   - Look for compilation errors
   - Check for API errors
   - Watch for database connection issues
   - Check for middleware errors

3. **Check Docker Logs (if applicable)**
   - PostgreSQL: `docker logs neuro-hub-db-1`
   - Check connection errors
   - Look for query errors
   - Verify database is running

4. **Common Issues to Look For**
   - [ ] Uncaught exceptions
   - [ ] Promise rejections
   - [ ] Type errors
   - [ ] Network failures (4xx, 5xx)
   - [ ] Database query errors
   - [ ] Missing environment variables
   - [ ] Build/compilation errors

5. **Fix Process**
   - Identify error source
   - Check stack trace
   - Describe the problem and propose 2-3 solution options
   - Wait for user's choice
   - Fix root cause
   - Re-run and verify
   - Check logs again
   - If the solution does not help, discuss with user

## Quick Commands
- Browser DevTools: `Cmd+Option+I` (Mac) or `F12` (Windows/Linux)
- Clear console: `console.clear()` or `Cmd+K`
- Filter logs: Use DevTools filter bar
- Watch mode: Keep terminal visible during development

## After Fix
- [ ] No errors in console
- [ ] No compilation errors
- [ ] All API calls succeed
- [ ] Database queries work
- [ ] Application functions as expected
