# /TestVisual Command

## Purpose
Run only visual regression tests for faster design iteration without functional test overhead.

## When to Use
- After making styling or design changes
- When iterating on visual design elements
- After CSS modifications or theme updates
- When you only need to verify visual appearance

## Implementation
```bash
cd "C:\Users\Thibault\Documents\Explora"
npx playwright test tests/visual/
```

## Expected Outcomes
- All visual regression tests run quickly
- Screenshot comparisons for UI components
- Visual diff reports for changed elements
- Design consistency validation across viewports

## Visual Test Coverage
- **Homepage layouts**: Desktop, tablet, mobile viewports
- **Component styling**: LocationCard, Navigation, Buttons
- **Design consistency**: Colors, typography, spacing
- **Responsive design**: Layout adaptations across screen sizes

## Screenshot Decision Framework

### **✅ UPDATE Screenshots When:**
- **New UI components**: Added TagSelector, modals, forms
- **Improved design**: Better spacing, colors, typography
- **Responsive fixes**: Fixed mobile layout issues
- **Feature styling**: New buttons, icons, visual elements
- **Design system updates**: Consistent style improvements

### **🔍 INVESTIGATE Screenshots When:**
- **Small differences (< 2%)**: Could be rendering variations
- **Font changes**: Might indicate loading issues
- **Color shifts**: Could suggest CSS loading problems
- **Unexpected layout shifts**: Might be unintended regressions

### **❌ DON'T UPDATE When:**
- **Browser artifacts**: Sub-pixel rendering differences
- **Timing issues**: Font loading or animation timing
- **Environment differences**: Resolution or scaling variations
- **Accidental breaks**: Unintended styling regressions

## Claude's Visual Analysis Template
```
📸 Visual Test Results

Components Tested: [X] passed, [Y] failed
- Homepage: [PASS/FAIL] - [Description]
- Navigation: [PASS/FAIL] - [Description]  
- LocationCard: [PASS/FAIL] - [Description]
- Buttons: [PASS/FAIL] - [Description]

Visual Changes Detected:
- [Component]: [X%] difference
  - Change type: [INTENTIONAL/ACCIDENTAL/UNCLEAR]
  - Recommendation: [UPDATE/INVESTIGATE/FIX]

Next Steps:
1. [Action based on analysis]
2. [Follow-up recommendation]
```

## Follow-up Actions
- **All PASS**: ✅ Design is consistent and stable
- **Failures detected**: Analyze each difference for intentionality
- **Use TestUI**: Review visual diffs interactively
- **Update snapshots**: If changes are approved design improvements

## Success Indicators
- Visual consistency maintained across components
- Design system compliance verified
- No unintended visual regressions
- Mobile responsive design validated

## Related Commands
- Use `/TestUI` for interactive visual debugging
- Use `/UpdateSnapshots` to approve design changes
- Use `/TestComponent [name]` for component-specific visual tests