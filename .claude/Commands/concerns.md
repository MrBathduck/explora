# /Concerns Command

> **Command Purpose:** Proactive quality check and issue identification

---

## 🎯 When User Types `/Concerns`

### **Claude Should:**
1. **Analyze recent work** - Review code quality, architecture, and UX
2. **Identify potential issues** - Security, performance, maintainability problems
3. **Prioritize concerns** - Critical/High/Medium/Low classification  
4. **Provide solutions** - Specific fixes with time estimates
5. **Validate project direction** - Ensure alignment with current phase goals

---

## 📋 Response Template

```
🔍 Quality Check: [Recent Work Area]

⚠️ Issues Found: [X] | ✅ Looking Good: [Y]

🔴 Critical Concerns:
- [Issue requiring immediate attention - time to fix]

🟡 Important Items:
- [Issue that should be addressed soon - time to fix]

🟢 Minor Suggestions:
- [Nice-to-have improvement for future]

✅ Positive Highlights:
- [Good practices being followed]
- [Smart decisions made]

🛠️ Recommended Actions:
1. [Most important fix - estimated time]
2. [Second priority item - estimated time]

Ready to tackle any of these? I can guide you through fixes!
```

---

## 🔍 Review Areas

### **Code Quality:**
- **Security** - API keys exposure, input validation, authentication
- **Performance** - Image optimization, query efficiency, memory usage
- **Organization** - File structure, component design, code duplication

### **Architecture:**
- **Scalability** - Database design, API structure, state management
- **Maintainability** - Documentation, testing, version control practices
- **Technical Debt** - Complexity accumulation, outdated dependencies

### **User Experience:**
- **Mobile/Responsive** - Touch targets, readability, layout breaks
- **Accessibility** - Color contrast, keyboard navigation, screen readers
- **User Flow** - Navigation clarity, error handling, loading states

### **Project Direction:**
- **Phase Alignment** - Work matches current phase objectives
- **Scope Management** - Avoiding feature creep, staying focused
- **Resource Allocation** - Time, budget, complexity appropriate for solo dev

---

## 🚨 Priority Guidelines

### **🔴 Critical (Fix Immediately):**
- Security vulnerabilities
- App broken on mobile/major browsers
- Data loss risks
- Performance making app unusable

### **🟡 Important (Fix This Week):**
- Poor UX affecting usability
- Technical debt slowing development
- Missing error handling
- Performance issues on some devices

### **🟢 Minor (Fix When Convenient):**
- UI inconsistencies
- Code organization improvements
- Nice-to-have optimizations
- Future-proofing considerations

---

## 📊 Solution Format

### **Always Include:**
- **Specific problem description** with impact explanation
- **Time estimate** for implementing fix
- **Step-by-step solution** approach
- **Priority rationale** based on user/development impact

### **Example:**
```
⚠️ Problem: API keys visible in browser console
🔍 Impact: Could lead to unauthorized usage and billing
⏱️ Time to Fix: 15 minutes
🛠️ Solution: Move to environment variables
📝 Steps: 1) Create .env.local 2) Move keys 3) Update code 4) Add to .gitignore
```

---

## 🎯 Success Criteria
- User understands quality issues without feeling criticized
- Clear action plan provided with realistic time estimates
- Concerns prioritized appropriately for current phase
- Solutions are specific and actionable