# /StartDay Command

> **Command Purpose:** Daily orientation and goal setting for vibe coder

---

## 🎯 When User Types `/StartDay`

### **Claude Should Respond With:**

#### **1. Current Project Status Check**
- Read CLAUDE.md for current phase and progress
- Check last update date and recent milestones
- Identify current development phase percentage

#### **2. Today's Priority Assessment**
- Review TODO.md "This Week" section
- Identify 1-2 realistic tasks for today
- Consider user's skill level and energy

#### **3. Recent Progress Celebration**
- Highlight yesterday's or recent achievements
- Check CHANGELOG.md for recent completions
- Build confidence and momentum

#### **4. Environment Check**
- Verify development environment is ready
- Check if any setup issues need addressing
- Ensure all tools are working properly

---

## 📋 Response Template

```
🌅 Good morning! Here's where we stand:

📍 Current Phase: [Phase Name] ([X]% complete)
🎯 Focus Area: [Current main objective]
🏆 Recent Win: [Latest achievement from CHANGELOG]

Today's Suggested Goals:
1. [Primary task - realistic and specific] ⭐
2. [Secondary task - if energy allows] 

📚 Learning Focus: [What skill/concept to focus on today]

🛠️ Environment Status: [All tools ready / Need to check X]

Ready to start? Need any reminders about setup or yesterday's work?
```

---

## 🔍 Specific Checks to Perform

### **Documentation Status:**
- ✅ Is CLAUDE.md current phase accurate?
- ✅ Are there completed tasks not marked in TODO.md?
- ✅ Any urgent items in PROBLEMS.md?

### **Development Environment:**
- ✅ Is development server running (if applicable)?
- ✅ Are there any pending updates or installations?
- ✅ Any error messages from previous session?

### **Energy and Motivation:**
- 🌟 Acknowledge progress made so far
- 🎯 Set realistic expectations for the day
- 💪 Encourage learning mindset over perfection

---

## 💡 Adaptive Responses

### **If User is in Phase 0 (Setup):**
- Focus on environment setup progress
- Emphasize that setup is temporary but important
- Celebrate each tool installation as real progress

### **If User is in Active Development:**
- Review current feature in progress
- Check for any blockers from previous session
- Plan incremental progress on current feature

### **If User Seems Overwhelmed:**
- Suggest smaller, more manageable tasks
- Remind them that learning takes time
- Offer simpler alternatives to complex tasks

### **If User is Making Great Progress:**
- Acknowledge momentum and skills development
- Suggest slightly more challenging tasks
- Prepare for next phase planning

---

## 🎯 Success Criteria

After `/StartDay` command, user should feel:
- ✅ Clear about what to work on today
- ✅ Confident about their recent progress
- ✅ Motivated to start coding/learning
- ✅ Aware of any technical issues to address

---

## 🔗 Related Commands

- Follow up with `/Status` for detailed progress
- Use `/Help [topic]` if user needs concept explanation
- Suggest `/TaskCompleted` when today's goals are finished