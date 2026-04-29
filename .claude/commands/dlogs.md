# Check Logs for Errors

Check server and Docker logs for errors during development or after implementing changes.

> Note: Browser console logs require the user to check DevTools directly (`Cmd+Option+I`). Claude can check server-side logs via terminal.

## Steps

### 1. Check server logs

Look at the terminal running `yarn dev`:

```bash
# if dev server is not visible, check recent output
```

Look for:
- Compilation errors
- API route errors
- Database connection issues
- Middleware errors
- Unhandled promise rejections

### 2. Check Docker logs (PostgreSQL)

```bash
docker logs neuro-hub-db-1
```

Look for:
- Connection errors
- Query errors
- Verify database is running

### 3. Check what to look for

- [ ] Uncaught exceptions
- [ ] Promise rejections
- [ ] TypeScript / build errors
- [ ] Network failures (4xx, 5xx)
- [ ] Database query errors
- [ ] Missing environment variables

### 4. Browser side (user checks DevTools)

Ask user to open `Cmd+Option+I` → Console and report:
- Red errors
- React hydration errors
- Failed network requests (Network tab)

### 5. Fix process

- Identify error source and stack trace
- Describe the problem
- Propose 2–3 solution options with pros/cons
- Wait for user's choice
- Fix root cause
- Re-check logs
- If the fix doesn't help, discuss with user

---

## After fix checklist

- [ ] No errors in server logs
- [ ] No compilation errors
- [ ] All API calls succeed
- [ ] Database queries work
- [ ] Application functions as expected
