# /Test Command

## Purpose
Run Playwright tests to verify UI functionality and catch regressions.

## When to Use
- After making UI changes
- Before suggesting deployment
- When debugging visual issues
- After adding new components

## Implementation
```bash
cd "C:\Users\Thibault\Documents\Explora"
npm test
```

## Expected Outcomes
- All functional tests pass (homepage loads, navigation works)
- All visual regression tests pass (screenshots match baseline)
- If tests fail due to intentional UI changes, suggest updating snapshots

## Follow-up Actions
- If visual tests fail due to intentional changes: run `npx playwright test --update-snapshots`
- If functional tests fail: investigate and fix the underlying issue
- Always ensure tests pass before marking work complete

## Success Indicators
- Exit code 0 (all tests pass)
- No failing tests in the output
- Visual differences are intentional and approved