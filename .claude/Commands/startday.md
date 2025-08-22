# /StartDay Command

> **Command Purpose:** Daily orientation and goal setting for current development phase

---

## 🎯 When User Types `/StartDay`

### **Claude Should Respond With:**

#### **1. Current Project Status Check**
- Read CLAUDE.md for current phase and progress
- Check phase-specific success criteria and completion percentage
- Identify current development priorities based on active phase
- Review any critical/high priority issues in PROBLEMS.md

#### **2. Today's Priority Assessment**
- Review TODO.md current phase priorities
- Focus on phase-appropriate tasks (location research, features, or optimization)
- Identify 1-2 realistic tasks for today based on current phase needs
- Consider user's skill level and phase complexity requirements

#### **3. Recent Progress Celebration**
- Highlight yesterday's or recent achievements from CHANGELOG.md
- Acknowledge progress toward current phase targets
- Celebrate completed features, milestones, or learning achievements
- Build confidence and momentum toward phase completion

#### **4. Environment Check**
- Verify development environment is ready for current phase work
- Check if phase-specific tools are available (research, development, testing)
- Ensure database architecture is ready for current phase complexity
- Confirm any specialized infrastructure is operational

---

## 📋 Response Template

```
🌅 Good morning! Here's where we stand:

📍 Current Phase: [Phase Name from CLAUDE.md] ([X]% complete)
🎯 Phase Focus: [Current phase main objectives]
🏆 Recent Win: [Latest achievement from CHANGELOG]

Today's Suggested Goals:
1. [Primary phase-appropriate task] ⭐
2. [Secondary task aligned with phase priorities] 

📚 Learning Focus: [Phase-relevant skills or concepts]

🛠️ Environment Status: [Development/Research/Testing tools ready]

📊 Phase Progress:
- [Key metric 1]: [Current status toward phase target]
- [Key metric 2]: [Progress indicator]
- [Key metric 3]: [Completion status]

Ready to advance toward phase completion? Need any setup reminders?
```

---

## 🔍 Specific Checks to Perform

### **Phase Documentation Status:**
- ✅ Is CLAUDE.md current phase progress accurate?
- ✅ Are phase-appropriate tasks progressing in TODO.md?
- ✅ Any critical issues blocking phase completion in PROBLEMS.md?
- ✅ Phase success criteria and targets on track?

### **Development Environment:**
- ✅ Is development server running for feature testing?
- ✅ Database ready for current phase data requirements?
- ✅ Phase-specific components operational?
- ✅ Any error messages from previous session work?

### **Phase-Specific Readiness:**
- ✅ Tools ready for current phase work (research, development, deployment)?
- ✅ Required resources available (cultural context, technical docs, APIs)?
- ✅ Infrastructure appropriate for phase complexity level?
- ✅ Quality frameworks operational for current phase validation?

---

## 💡 Adaptive Responses

### **If User is in Early Phase (Setup/Foundation):**
- Focus on environment setup and basic feature progress
- Emphasize foundation building and core functionality
- Celebrate each milestone as important progress
- Prepare for next phase complexity

### **If User is in Active Development Phase:**
- Review current feature or database work in progress
- Check for any technical or design blockers from previous session
- Plan incremental progress on phase-specific deliverables
- Connect current work to phase success criteria

### **If User is in Advanced Phase:**
- Focus on sophisticated features, optimization, or scaling
- Review complex integrations or advanced functionality
- Plan work on AI features, cultural adaptation, or global systems
- Prepare for phase completion and next phase transition

### **If User Seems Overwhelmed by Phase Complexity:**
- Break down phase requirements into smaller, manageable tasks
- Suggest focusing on single components before integration
- Offer simpler approaches before attempting advanced features
- Remind that each phase builds foundation for the next

---

## 🎯 Success Criteria

After `/StartDay` command, user should feel:
- ✅ Clear about current phase priorities and objectives
- ✅ Confident about their progress toward phase completion
- ✅ Motivated to advance phase-appropriate features or research
- ✅ Aware of any technical issues blocking phase advancement

---

## 🔗 Related Commands

- Follow up with `/Status` for detailed current phase progress
- Use `/Help [topic]` for phase-appropriate concept guidance
- Suggest `/TaskCompleted` when phase goals are finished
- Use `/FeatureRequest` for new phase enhancement ideas
- Use `/ReportIssue` if bugs are discovered during development