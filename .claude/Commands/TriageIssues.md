# /TriageIssues Command Specification

## Command Purpose
Process all issues in the "New Issues" section of problems.md and automatically categorize them by priority.

## Usage
```
/TriageIssues
```

## Claude Code Response Process

### Step 1: Read New Issues
- Scan problems.md "New Issues (Needs Categorization)" section
- Extract all issues from both quick entry and detailed entry areas
- Clear the "New Issues" section after processing

### Step 2: Categorize Each Issue
For each issue, assign priority based on:

#### 🔴 Critical Priority:
- App crashes or won't load
- Core features completely broken (auth, trip planning, location browsing)
- Data loss or security issues

#### 🟡 High Priority:
- Major features significantly impaired
- Mobile experience broken
- Performance issues affecting most users

#### 🟠 Medium Priority:
- Feature bugs with workarounds available
- UI inconsistencies
- Performance issues on specific devices

#### 🟢 Low Priority:
- Cosmetic issues
- Minor improvements
- Edge case bugs

### Step 3: Format and Move Issues
- Add properly formatted entries to appropriate priority sections
- Assign unique BUG-XXX identifiers
- Include estimated fix time (30min/2hrs/1day/1week)
- Add to TODO.md if Critical or High priority

## Response Template

```markdown
## 🎯 Issue Triage Complete

### Issues Processed: [Number]
- 🔴 Critical: [Number] issues
- 🟡 High: [Number] issues  
- 🟠 Medium: [Number] issues
- 🟢 Low: [Number] issues

### 🚨 Immediate Action Required:
[List critical issues that need fixing now]

### 📅 This Week Priority:
[List high priority issues for current sprint]

### 📋 Backlog:
[Medium/low issues scheduled for future]

✅ Problems.md updated with categorized issues
✅ TODO.md updated with urgent tasks (if any)
```

## Integration Actions

### For Critical/High Issues:
1. Add to appropriate problems.md priority section
2. Add to TODO.md under current sprint if blocks Phase 3
3. Include in immediate action list

### For Medium/Low Issues:
1. Add to appropriate problems.md priority section  
2. Note for future phase cleanup
3. Group similar issues for batch fixing

## Success Criteria
- All new issues categorized and moved from "New Issues" section
- Critical issues flagged for immediate attention
- TODO.md updated with blocking issues
- Clear priority guidance provided for next actions