# /Review Command

> **Command Purpose:** Review latest changes or specific components for quality and issues

---

## 🎯 When User Types `/Review [optional: specific component]`

### **Claude Should:**
1. **Determine review scope** - Recent changes (default) or specific component/file
2. **Analyze code quality** - Check for bugs, performance issues, best practices
3. **Evaluate user experience** - Mobile responsiveness, accessibility, usability
4. **Assess architecture** - Code organization, maintainability, scalability
5. **Provide actionable feedback** - Specific improvements with priority and time estimates

---

## 📋 Response Template

```
🔍 Code Review: [Scope - Recent Changes/Specific Component]

📊 Quality Assessment: [X] issues found | [Y] improvements suggested

🔴 Critical Issues:
- [Issue requiring immediate fix - time estimate]

🟡 Important Improvements:
- [Significant enhancement opportunity - time estimate]

🟢 Minor Suggestions:
- [Nice-to-have optimization - time estimate]

✅ Good Practices Observed:
- [Positive patterns being followed]
- [Smart decisions made]

🛠️ Priority Actions:
1. [Most important fix/improvement - estimated effort]
2. [Second priority item - estimated effort]

📋 Overall Assessment: [Brief summary of code health]

Ready to tackle any improvements? I can guide you through specific fixes!
```

---

## 🔍 Review Scope Detection

### **No Parameter - Recent Changes Review:**
```bash
/Review
```
- **Analyze recent commits** - Check latest Git changes or session work
- **Focus on new code** - Recently added components, features, or modifications
- **Identify regression risks** - Changes that might break existing functionality

### **Component-Specific Review:**
```bash
/Review LocationCard
/Review trip-planner
/Review authentication
```
- **Deep dive analysis** - Comprehensive review of specific component or feature
- **Cross-component impact** - How changes affect related parts of the app
- **Targeted recommendations** - Specific to the component's functionality

### **File/Directory Review:**
```bash
/Review src/components/TripPlanner.jsx
/Review components/auth
```
- **File-level analysis** - Detailed code review of specific files
- **Directory review** - Analysis of related component groups

---

## 🔍 Review Categories

### **Code Quality Analysis:**
- **Bug Detection** - Logic errors, null checks, edge cases
- **Performance Issues** - Inefficient algorithms, memory leaks, unnecessary renders
- **Security Concerns** - Input validation, API key exposure, data handling
- **Code Organization** - File structure, component design, separation of concerns

### **User Experience Evaluation:**
- **Mobile Responsiveness** - Touch targets, layout, readability on small screens
- **Accessibility** - Color contrast, keyboard navigation, screen reader support
- **User Flow** - Navigation clarity, error handling, loading states
- **Performance** - Load times, interaction responsiveness, offline functionality

### **Architecture Assessment:**
- **Maintainability** - Code readability, documentation, testing approach
- **Scalability** - Database queries, component reusability, state management
- **Best Practices** - Framework conventions, naming consistency, error boundaries
- **Technical Debt** - Areas needing refactoring, outdated patterns, complexity accumulation

---

## 🚨 Priority Classification

### **🔴 Critical (Fix Immediately):**
- **Security vulnerabilities** - API keys exposed, injection risks
- **Breaking bugs** - App crashes, core functionality broken
- **Performance killers** - App unusable due to poor performance
- **Data integrity issues** - Risk of data loss or corruption

### **🟡 Important (Fix This Sprint):**
- **UX problems** - Poor mobile experience, confusing navigation
- **Performance issues** - Slow loading, inefficient operations
- **Code quality** - Hard to maintain, potential for future bugs
- **Missing error handling** - Unhandled edge cases, poor error messages

### **🟢 Minor (Improve When Possible):**
- **Code organization** - File structure, naming conventions
- **Optimization opportunities** - Performance improvements for edge cases
- **Enhancement ideas** - Better user experience, additional features
- **Documentation** - Code comments, README updates

---

## 📊 Review Examples

### **Recent Changes Review:**
```
User: /Review

Response:
🔍 Code Review: Recent Changes (Last 3 commits)

📊 Quality Assessment: 2 issues found | 3 improvements suggested

🟡 Important Improvements:
- LocationCard component missing error boundary (30 minutes)
- Search function not debounced - causing excessive API calls (15 minutes)

🟢 Minor Suggestions:
- Add loading states to trip planner components (45 minutes)
- Consistent naming convention for CSS classes (20 minutes)
- Add PropTypes or TypeScript validation (1 hour)

✅ Good Practices Observed:
- Proper use of React hooks and state management
- Good separation of concerns in component structure
- Consistent error handling in API calls

🛠️ Priority Actions:
1. Add search debouncing to prevent API abuse (15 min)
2. Implement error boundary for LocationCard (30 min)

📋 Overall Assessment: Code quality is good with minor performance optimizations needed
```

### **Component-Specific Review:**
```
User: /Review TripPlanner

Response:
🔍 Code Review: TripPlanner Component

📊 Quality Assessment: 1 critical issue | 2 important improvements

🔴 Critical Issues:
- Drag and drop state not properly cleaned up - memory leak risk (45 minutes)

🟡 Important Improvements:
- No keyboard navigation support for accessibility (1.5 hours)
- Trip validation logic should be extracted to custom hook (30 minutes)

🟢 Minor Suggestions:
- Add unit tests for trip manipulation functions (2 hours)

✅ Good Practices Observed:
- Clean component structure with logical separation
- Proper use of useEffect for cleanup
- Good error handling for invalid trip data

🛠️ Priority Actions:
1. Fix drag-and-drop cleanup to prevent memory leaks (45 min)
2. Add keyboard navigation for accessibility compliance (1.5 hours)

📋 Overall Assessment: Solid component with one critical memory issue to address
```

---

## 🛠️ Solution Format

### **Always Include:**
- **Specific problem description** with potential impact
- **Step-by-step approach** or guidance offer
- **Testing recommendations** to verify fix

### **Example Issue Format:**
```
🟡 Issue: Search input not debounced
📍 Location: src/components/SearchBar.jsx line 45
🔍 Impact: Excessive API calls on every keystroke (performance + cost)
🛠️ Solution: Add useDebounce hook with 300ms delay
📝 Steps: 1) Create useDebounce hook 2) Wrap search function 3) Test with rapid typing
🧪 Testing: Verify API calls reduced in network tab
```

---

## 🔄 Follow-up Integration

### **Automatic Actions:**
- **Create issues** in PROBLEMS.md for critical/important findings
- **Update TODO.md** with improvement tasks if user requests
- **Suggest related commands** - `/Help`, `/Stuck`, `/FeatureRequest`

### **Quality Tracking:**
- **Track review frequency** - Encourage regular code reviews
- **Monitor improvement trends** - Note if code quality improving over time
- **Celebrate progress** - Acknowledge when previous review items resolved

---

## 🎯 Success Criteria
- User understands specific quality issues in recent work
- Clear priority and time estimates provided for improvements
- Actionable guidance given without overwhelming
- Positive practices acknowledged to build confidence
- Review leads to measurable code quality improvements