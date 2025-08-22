# /UpdateSnapshots Command

## Purpose
Update Playwright visual test baselines after confirming UI changes are intentional and approved.

## When to Use
- After intentional design improvements or new features
- When visual tests fail due to legitimate UI changes
- After confirming changes through /TestUI or /TestVisual
- When migrating to new design system elements

## Implementation
```bash
cd "C:\Users\Thibault\Documents\Explora"
npx playwright test --update-snapshots
```

## Before Running - Verification Checklist
Claude should ALWAYS verify before updating:

### ✅ **Safe to Update When:**
- **Intentional design changes**: New components, improved styling
- **Feature additions**: New UI elements, buttons, forms
- **Bug fixes**: Corrected visual issues or layout problems
- **Approved design iterations**: Confirmed improvements to UX
- **Responsive design fixes**: Better mobile/tablet layouts

### ❌ **DON'T Update When:**
- **Tests failing unexpectedly**: Investigate root cause first
- **Accidental changes**: Unintended visual regressions
- **Browser artifacts**: Sub-pixel differences or font loading issues
- **Unknown changes**: Unclear what caused the visual differences

## Pre-Update Analysis Template
```
📸 Snapshot Update Analysis

Visual Changes Summary:
- [Component]: [Description of change]
- [Component]: [Description of change]

Change Assessment:
✅ Intentional: [List confirmed intentional changes]
❌ Accidental: [List any unintended changes to investigate]
🔍 Unclear: [List changes that need review]

Recommendation: [SAFE TO UPDATE / INVESTIGATE FIRST / FIX ISSUES]

Files that will be updated:
- tests/visual/design.spec.ts-snapshots/[specific files]
```

## Post-Update Verification
After updating snapshots, Claude should:

1. **Run tests again** to confirm all pass
2. **Verify no new regressions** introduced
3. **Document the visual changes** in commit/changelog
4. **Confirm mobile responsive** design still works

## Success Indicators
- All visual tests pass after update
- No unintended side effects on other components
- Design changes align with intended improvements
- Mobile and desktop layouts both work correctly

## Warning Signs - Stop and Investigate
🚨 **Don't proceed if:**
- Many unexpected files are changing
- Layout appears broken in screenshots
- Mobile layouts are severely affected
- Core navigation or functionality looks wrong

## Recovery Process
If snapshots were updated incorrectly:
```bash
git checkout HEAD -- tests/visual/design.spec.ts-snapshots/
npm test
```
This restores previous baselines for fresh analysis.

## Related Commands
- Use `/TestVisual` first to analyze what will change
- Use `/TestUI` to review changes interactively
- Use `/Test` after updating to confirm everything passes