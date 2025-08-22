# /TestComponent Command

## Purpose
Run Playwright tests for specific components to get faster feedback during development.

## When to Use
- When working on a specific component (LocationCard, Navigation, etc.)
- After making changes to component styling or behavior
- For faster iteration without running full test suite
- When debugging component-specific issues

## Usage
`/TestComponent [component-name]`

Examples:
- `/TestComponent LocationCard`
- `/TestComponent Navigation` 
- `/TestComponent TagSelector`

## Implementation
```bash
cd "C:\Users\Thibault\Documents\Explora"
npx playwright test --grep "[component-name]"
```

## Expected Outcomes
- Only tests related to the specified component run
- Faster execution than full test suite
- Component-specific visual regression testing
- Targeted feedback on component quality

## Follow-up Actions
- If tests PASS: ✅ Component is working correctly
- If tests FAIL: 🔍 Focus on component-specific issues
- **📸 Visual Changes:** Review component screenshot differences

## Component Test Mapping
- **LocationCard**: `location card styling`, `location-card.png`
- **Navigation**: `navigation component appears correctly`, `navigation.png`
- **Buttons**: `primary buttons have correct styling`, `primary-button.png`
- **Homepage**: `homepage layout on desktop`, `homepage-desktop.png`
- **TagSelector**: Tests for tag selection components (when added)

## Screenshot Update Guidance
**When to update component screenshots:**
- ✅ **Intentional design improvements** to the component
- ✅ **New component features** or states added
- ✅ **Fixed styling bugs** in the component
- ❌ **Accidental regressions** or unintended changes

## Success Indicators
- Component tests pass consistently
- Visual output matches design intentions
- No unintended side effects on other components