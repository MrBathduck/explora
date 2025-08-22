# /ReportIssue Command Specification

## Command Purpose
Quickly report bugs and issues during development, with automatic categorization and integration into the problems.md workflow.

## Usage
```
/ReportIssue [issue description]
```

## Input Format Options

### Option 1: Quick Report (Most Common)
```
/ReportIssue Location modal doesn't close when clicking outside on mobile
```

### Option 2: Detailed Report
```
/ReportIssue
Bug: Trip drag-and-drop not working
Steps: 1) Open trip planner 2) Try to drag location between days 3) Nothing happens
Expected: Location moves to different day
Actual: Location stays in place, no visual feedback
Browser: Chrome on Windows 11
```

### Option 3: Multiple Issues
```
/ReportIssue
- Search results pagination broken on mobile
- Tag selector animation jerky on slow devices  
- Back button in settings goes to wrong page
```

## Claude Code Response Process

### Step 1: Immediate Analysis
For each reported issue, analyze:
- **Severity Level:** Critical | High | Medium | Low
- **Feature Area:** Authentication | Trip Planning | Location Discovery | UI/UX | Performance
- **User Impact:** Blocks workflow | Degrades experience | Minor annoyance
- **Fix Complexity:** Quick (30min) | Medium (2-4hrs) | Large (1+ days)

### Step 2: Priority Assignment Logic

#### 🔴 Critical Priority:
- App crashes or won't load
- Core features completely broken (authentication, trip creation, location browsing)
- Data loss or corruption
- Security vulnerabilities
- Blocks current phase completion

#### 🟡 High Priority:
- Major features significantly impaired but workaround exists
- Mobile experience broken on primary user flows
- Performance issues affecting majority of users
- UX problems causing user frustration in core flows

#### 🟠 Medium Priority:
- Feature bugs with clear workarounds available
- UI inconsistencies that don't block functionality
- Performance issues on specific devices/browsers
- Accessibility problems
- Edge case scenarios in normal features

#### 🟢 Low Priority:
- Cosmetic issues and minor UI improvements
- Very specific device/browser combinations
- Nice-to-have enhancements disguised as bugs
- Documentation or help text issues

### Step 3: Issue Integration

#### For Critical/High Issues:
1. **Add to problems.md** in appropriate priority section
2. **Add to TODO.md** as urgent task if blocks current work
3. **Alert about immediate action** if breaks core functionality
4. **Estimate fix time** and impact on current sprint

#### For Medium/Low Issues:
1. **Add to problems.md** in appropriate section
2. **Note for future phases** if not urgent
3. **Group with similar issues** for batch fixing
4. **Document patterns** if recurring issue type

## Response Template

```markdown
## 🐛 Issue Report Processed

### ✅ Added to Problems.md:

**BUG-XXX: [Issue Title]** [🔴/🟡/🟠/🟢]
- **Category:** [Feature Area]
- **Priority:** [Critical/High/Medium/Low] 
- **Estimated Fix:** [Time estimate]
- **Impact:** [User experience impact]

### 🚨 Immediate Actions Required:
[Only if Critical/High priority]
- [Specific action needed]
- [Impact on current work]
- [Recommended timeline]

### 📅 Added to Current Tasks:
[Only if needs immediate attention]
- Added to TODO.md under [section]
- Blocks: [what this prevents]
- Suggested priority: [within current sprint]

### 📊 Issue Summary:
- **Total Active Issues:** [count]
- **Critical:** [count] 
- **High:** [count]
- **Medium:** [count] 
- **Low:** [count]

### 💡 Recommendations:
[Context-aware suggestions based on issue type and current phase]
```

## Integration Examples

### Example 1: Critical Bug During Development
```
User: /ReportIssue Firebase authentication completely broken - users can't sign in

Claude Response:
🚨 CRITICAL ISSUE BUG-047 Added

**BUG-047: Firebase Authentication Failure** 🔴
- Category: Authentication
- Priority: Critical - Blocks core user flow
- Estimated Fix: 2-4 hours (investigate + fix)
- Impact: Users cannot access cloud features

🚨 IMMEDIATE ACTION REQUIRED:
- This blocks current phase completion
- Added to TODO.md as urgent task
- Recommend fixing before any other development

📊 Active Issues: 1 Critical, 3 High, 7 Medium, 12 Low
💡 Check Firebase console for service status and recent config changes
```

### Example 2: Medium Priority UI Issue
```
User: /ReportIssue Location cards have inconsistent spacing on tablet devices

Claude Response:
✅ Issue Added to Problems.md

**BUG-048: Tablet Layout Spacing Inconsistency** 🟠
- Category: UI/UX  
- Priority: Medium - Visual inconsistency with workaround
- Estimated Fix: 1-2 hours (CSS responsive adjustments)
- Impact: Minor visual inconsistency on tablet viewport

📅 Scheduled for: Phase 3 UI polish tasks
📊 Active Issues: 0 Critical, 3 High, 8 Medium, 12 Low
💡 Good candidate for batch fixing with other responsive design issues
```

### Example 3: Multiple Quick Issues
```
User: /ReportIssue
- Search placeholder too light on mobile
- Trip export button not working
- Location modal images loading slowly

Claude Response:
✅ 3 Issues Processed and Added

**BUG-049: Mobile Search Placeholder Visibility** 🟢
- Category: UI/UX, Priority: Low, Fix: 15 minutes

**BUG-050: Trip Export Functionality Broken** 🟡  
- Category: Trip Planning, Priority: High, Fix: 1-2 hours

**BUG-051: Location Modal Image Performance** 🟠
- Category: Performance, Priority: Medium, Fix: 2-3 hours

🚨 HIGH PRIORITY DETECTED:
- BUG-050 affects core trip planning feature
- Added to TODO.md for immediate attention
- Recommend fixing this week

📊 Active Issues: 0 Critical, 4 High, 9 Medium, 13 Low
```

## Workflow Integration

### Daily Development Pattern:
1. **Encounter bug** → `/ReportIssue [quick description]`
2. **Continue development** → Don't interrupt flow to fix immediately  
3. **End of session** → Review critical/high issues for next session planning
4. **Sprint planning** → Use TODO.md integration for priority setting

### Quality Assurance Integration:
- **Before committing code** → Check if any critical issues need fixing
- **Before phase completion** → Resolve all critical, plan high priority fixes
- **Testing sessions** → Use `/ReportIssue` for systematic bug collection

## Advanced Usage

### Issue Pattern Recognition:
Claude Code will identify patterns:
- **Recurring mobile issues** → Suggest responsive design audit
- **Performance issues** → Recommend performance optimization sprint  
- **Authentication edge cases** → Suggest auth flow testing session

### Contextual Recommendations:
Based on current phase and reported issues:
- **Current phase focus** → Prioritize issues related to the current phase
- **Pre-deployment** → Escalate any issues that affect user experience
- **Post-user feedback** → Cross-reference reported bugs with user complaints

## Success Criteria
- No bugs lost or forgotten during development flow
- Critical issues identified and flagged immediately  
- Appropriate prioritization prevents scope creep from bug fixing
- Integration with TODO.md ensures important bugs get fixed
- Clear categorization enables batch fixing and pattern recognition