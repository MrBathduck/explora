# /Update Command

> **Command Purpose:** Update documentation with new progress

---

## 🎯 When User Types `/Update [what changed]`

### **Claude Should:**
1. **Update CHANGELOG.md** - Add achievement to appropriate version section
2. **Modify TODO.md** - Mark completed tasks, update current session
3. **Update CLAUDE.md** - Refresh phase progress indicators
4. **Add to NOTES.md** - Record learning insights (if significant)
5. **Confirm all updates** - Verify changes were made successfully

---

## 📋 Response Template

```
📝 Documentation Updated!

✅ Files Modified:
- CHANGELOG.md: [Specific addition made]
- TODO.md: [Task status updated]
- CLAUDE.md: [Progress indicators refreshed]
- NOTES.md: [Learning recorded - if applicable]

🎉 Achievement Logged: [What was accomplished]

📈 Progress Impact: [How this advances current phase]

All your hard work is now properly documented! 🌟
```

---

## 🔄 Update Logic

### **Determine Update Scope:**
- **Major milestone** → CHANGELOG.md entry + full documentation update
- **Task completion** → TODO.md status change + CLAUDE.md progress
- **Bug fix** → PROBLEMS.md resolution + CHANGELOG.md patch entry
- **Learning insight** → NOTES.md entry + skill development tracking

### **Smart Documentation Updates:**
- **Read current phase** from CLAUDE.md to determine appropriate sections
- **Update progress metrics** toward current phase success criteria
- **Move completed tasks** from active to completed sections
- **Add version entries** following semantic versioning (major.minor.patch)

---

## 📊 Examples

### **Feature Completion:**
```
User: /Update Implemented drag-and-drop trip planning

Response:
📝 Documentation Updated!
✅ Files Modified:
- CHANGELOG.md: Added "Drag-and-drop trip planning" to current version features
- TODO.md: Moved trip planner task from High Priority to completed
- CLAUDE.md: Updated trip planner progress indicators
- NOTES.md: Recorded UX insights about drag-and-drop interactions

🎉 Achievement Logged: Drag-and-drop trip planning functionality complete
📈 Progress Impact: Major advancement toward enhanced user experience goals
```

### **Bug Fix:**
```
User: /Update Fixed mobile search button not working

Response:
📝 Documentation Updated!
✅ Files Modified:
- CHANGELOG.md: Added bug fix to patch section
- PROBLEMS.md: Marked BUG-045 as resolved
- TODO.md: Removed mobile search issue from current tasks

🎉 Achievement Logged: Mobile search functionality restored
📈 Progress Impact: Improved mobile user experience reliability
```

## 🎯 Success Criteria
- All relevant documentation files updated consistently
- Progress toward current phase accurately reflected
- Achievements properly categorized and recorded
- Cross-references between files maintained