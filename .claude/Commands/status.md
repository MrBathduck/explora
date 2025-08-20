# /Status Command

> **Command Purpose:** Show detailed progress on current feature/task

---

## 🎯 When User Types `/Status`

### **Claude Should Respond With:**

#### **1. Current Task Identification**
- Identify what specific feature/task user is working on
- Reference TODO.md and recent NOTES.md entries
- Determine scope and complexity of current work

#### **2. Progress Visualization**
- Show percentage completion with progress bar
- List completed sub-tasks vs. remaining work
- Estimate time/effort remaining

#### **3. Blocker Detection**
- Identify any technical obstacles
- Check for missing dependencies or setup issues
- Note any learning gaps that might slow progress

#### **4. Next Step Clarity**
- Clearly state what the immediate next action should be
- Break down complex next steps into simple actions
- Provide confidence in forward momentum

---

## 📋 Response Template

```
📊 Current Status: [Feature/Task Name]

Progress: [████████░░] [X]% Complete

✅ Completed:
- [Specific completed item 1]
- [Specific completed item 2]
- [Specific completed item 3]

🔄 In Progress:
- [Current active work item]

📋 Remaining:
- [Next item to complete]
- [Additional remaining items]

🚧 Blockers: [None detected / Specific blocker with solution]

⏭️ Immediate Next Step: [Very specific action to take]

🎯 Success Criteria: [How to know this task is truly complete]
```

---

## 🔍 Detailed Analysis Framework

### **For Setup Tasks (Phase 0):**
- Check installation completeness
- Verify configuration accuracy
- Test basic functionality
- Identify common setup pitfalls

### **For Development Tasks:**
- Assess code functionality
- Check file structure organization
- Verify feature requirements are met
- Evaluate code quality for beginner level

### **For Learning Tasks:**
- Measure concept comprehension
- Identify knowledge gaps
- Suggest practical application exercises
- Plan skill building progression

---

## 📊 Progress Calculation Guidelines

### **0-25% Complete:**
- Basic setup or planning done
- Dependencies identified and installed
- Clear understanding of requirements

### **25-50% Complete:**
- Core structure in place
- Basic functionality working
- Main components created

### **50-75% Complete:**
- Feature mostly functional
- Minor issues being resolved
- Testing and refinement in progress

### **75-100% Complete:**
- Feature working as intended
- No critical bugs remaining
- Ready for user testing or next phase

---

## 🚨 Blocker Detection Checklist

### **Technical Blockers:**
- ❌ Missing dependencies or packages
- ❌ Configuration errors
- ❌ API keys or permissions issues
- ❌ Version compatibility problems

### **Knowledge Blockers:**
- ❌ Concepts too advanced for current skill level
- ❌ Documentation or tutorials needed
- ❌ Multiple new concepts at once
- ❌ Debugging skills insufficient

### **Process Blockers:**
- ❌ Unclear requirements or goals
- ❌ Too many tasks attempted simultaneously
- ❌ Perfectionism preventing progress
- ❌ Overwhelm from complexity

---

## 💡 Adaptive Status Responses

### **If Making Great Progress:**
```
🎉 Excellent momentum! You're crushing this task.
Consider tackling [slightly more challenging element] next.
```

### **If Stuck/Slow Progress:**
```
🤔 Let's break this down further. Sometimes slower is faster.
Would you like me to simplify the next step?
```

### **If Overwhelmed:**
```
📚 This is a lot to learn at once. That's normal!
Let's focus on just getting [one small thing] working first.
```

### **If Nearly Complete:**
```
🏁 You're almost there! Don't give up now.
Let's finish strong and then celebrate this win!
```

---

## 🎯 Success Criteria

After `/Status` command, user should:
- ✅ Clearly understand where they are in current task
- ✅ Know exactly what to do next
- ✅ Feel confident about their progress
- ✅ Have realistic expectations about remaining work

---

## 🔗 Related Commands

- Use `/Concerns` if blockers are detected
- Suggest `/TaskCompleted` if 90%+ complete
- Recommend `/NextTask` if current task is finished
- Offer `/Stuck` if user expresses frustration