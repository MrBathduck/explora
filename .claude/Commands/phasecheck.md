markdown# /PhaseCheck Command

> **Command Purpose:** Evaluate current phase completion against roadmap criteria

---

## 🎯 When User Types `/PhaseCheck`

### **Claude Should:**
1. **Read current phase** from CLAUDE.md and TODO.md progress
2. **Consult roadmap** - Check "Explora Development Phases - Revised Roadmap" 
3. **Evaluate completion** - Compare actual progress vs roadmap success parameters
4. **Check quality gates** - Verify critical/high issues resolved per roadmap
5. **Recommend action** - Advance phase, continue current work, or address blockers

---

## 📋 Response Template
🗺️ Phase Completion Check: [Current Phase Name]
📊 Roadmap Comparison:
✅ Complete: [X] objectives | 🔄 In Progress: [Y] | ⏳ Not Started: [Z]
🎯 Success Parameters:

[Parameter 1]: [Status vs Target]
[Parameter 2]: [Status vs Target]
[Parameter 3]: [Status vs Target]

🚨 Blocking Issues:

[Critical/High issues preventing advancement]

📈 Phase Completion: [X]% based on roadmap criteria
🛠️ Recommendation:
[Advance to next phase / Continue current work / Address specific blockers]
Next: [Specific action needed for phase advancement]

---

## 🔍 Roadmap Integration Process

1. **Open roadmap document** - "Explora Development Phases - Revised Roadmap"
2. **Find current phase section** - Match with CLAUDE.md current phase
3. **Check success parameters** - Compare actual vs roadmap targets
4. **Evaluate quality gates** - Ensure critical issues resolved
5. **Assess next phase readiness** - Prerequisites met for advancement

## 🎯 Success Criteria
- Accurate assessment against roadmap criteria
- Clear guidance on phase advancement readiness
- Specific actions needed for progression
Copy-paste these directly into the respective command files! 🎯