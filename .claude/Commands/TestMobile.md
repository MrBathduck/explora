# /TestMobile Command

## Purpose
Run mobile-specific Playwright tests to validate responsive design and mobile user experience.

## When to Use
- After making responsive design changes
- When adding new mobile-specific features
- Before deploying mobile-sensitive updates
- When debugging mobile layout issues

## Implementation
```bash
cd "C:\Users\Thibault\Documents\Explora"
npx playwright test --grep "mobile"
```

## Expected Outcomes
- Mobile viewport tests run (375x667 resolution)
- Touch-friendly interface validation
- Mobile layout screenshot comparisons
- Mobile-specific user interaction tests

## Mobile Test Coverage
- **Layout responsiveness**: Components adapt to small screens
- **Touch targets**: Buttons and links are appropriately sized
- **Navigation**: Mobile menu and navigation work correctly
- **Forms**: Input fields and forms are mobile-friendly
- **Content**: Text and images scale appropriately

## Screenshot Update Scenarios
**📸 Update mobile screenshots when:**
- ✅ **Improved mobile layouts**: Better responsive design
- ✅ **Added mobile features**: Touch gestures, mobile menus
- ✅ **Fixed mobile bugs**: Corrected spacing, sizing, alignment
- ✅ **Enhanced mobile UX**: Better touch targets, readability

**❌ Don't update when:**
- Browser rendering variations (< 1% difference)
- Font loading timing differences
- Accidental mobile layout breaks

## Follow-up Actions
- If tests PASS: ✅ Mobile experience is working well
- If tests FAIL: 🔍 Focus on mobile-specific issues
- **📱 Layout Issues:** Use TestUI to debug responsive problems
- **🎯 Touch Problems:** Verify button sizes and spacing

## Success Indicators
- All mobile viewport tests pass
- Touch targets meet accessibility guidelines (44px minimum)
- Content is readable without horizontal scrolling
- Navigation works smoothly on mobile devices

## Related Commands
- Use `/TestUI` to debug mobile layout issues visually
- Use `/TestComponent` to test individual components on mobile
- Use `/UpdateSnapshots` if mobile improvements are intentional