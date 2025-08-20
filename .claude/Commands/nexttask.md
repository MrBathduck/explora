# /NextTask Command

> **Command Purpose:** Identify and explain the next logical development step

---

## 🎯 When User Types `/NextTask`

### **Claude Should Respond With:**

#### **1. Current Task Completion Verification**
- Confirm previous task is actually complete
- Check for any loose ends or quality issues
- Ensure proper documentation and progress tracking
- Verify readiness for next challenge

#### **2. Next Task Identification**
- Analyze TODO.md and roadmap for logical progression
- Consider user's current skill level and energy
- Choose task that builds on recent learning
- Ensure appropriate difficulty progression

#### **3. Task Breakdown and Explanation**
- Break complex task into simple, manageable steps
- Explain why this task is important for the project
- Estimate time and effort required
- Identify what new skills or concepts will be learned

#### **4. Prerequisites and Preparation Check**
- Verify all necessary tools and accounts are ready
- Check for any dependencies or setup requirements
- Ensure understanding of concepts needed
- Confirm energy level and time availability

---

## 📋 Response Template

```
🚀 Next Task: [Task Name]

✅ Prerequisites Check:
- [Requirement 1] ✅/❌
- [Requirement 2] ✅/❌  
- [Requirement 3] ✅/❌

📋 What This Task Involves:
1. [Step 1 - simple and specific]
2. [Step 2 - builds on step 1]
3. [Step 3 - completion criteria]

⏱️ Estimated Time: [X] hours ([Y] for learning, [Z] for implementation)
🎯 Success Criteria: [How you'll know it's complete]
📚 New Skills: [What you'll learn doing this]

🔥 Why This Matters: [How this task helps users/project]

Ready to start? Say 'yes' and I'll walk you through step 1!
Type /Stuck if you want to try something simpler first.
```

---

## 🗺️ Task Selection Logic

### **Priority Framework:**
1. **Blocking Dependencies** - Tasks that unlock other work
2. **User Value** - Features that directly help travelers
3. **Learning Progression** - Skills that build on previous knowledge
4. **Momentum Builders** - Tasks that feel rewarding to complete

### **Skill Level Considerations:**

#### **Beginner (0-2 weeks):**
- Focus on setup and basic functionality
- One new concept per task maximum
- Lots of copy-paste with explanation
- Immediate visual results when possible

#### **Learning (2-8 weeks):**
- Combine 2-3 familiar concepts
- Introduce problem-solving elements
- More original thinking required
- Focus on understanding "why" not just "how"

#### **Developing (2+ months):**
- Complex features with multiple components
- Research and decision-making involved
- Creative problem-solving encouraged
- Planning and architecture considerations

---

## 📊 Task Categorization

### **Setup Tasks (Foundation):**
- Environment configuration
- Account creation and API setup
- Tool installation and verification
- Basic project structure

**Next Task Examples:**
- "Set up Google Maps API key and test basic integration"
- "Configure Firebase project with security rules"
- "Install and configure development tools"

### **Feature Development (Building):**
- User interface components
- Data handling and storage
- Third-party service integration
- User experience improvements

**Next Task Examples:**
- "Create a location card component that displays place info"
- "Add search functionality to filter locations by name"
- "Implement user authentication with Google login"

### **Polish and Enhancement (Refining):**
- Performance optimization
- Mobile responsiveness
- Error handling and edge cases
- User experience refinements

**Next Task Examples:**
- "Add loading states and error messages for better UX"
- "Optimize app performance for mobile devices"
- "Implement offline functionality for saved itineraries"

---

## 🎯 Difficulty Progression Guidelines

### **Easy Tasks (Green Light 🟢):**
- Build directly on just-completed work
- Use familiar tools and concepts
- Clear step-by-step instructions available
- Quick wins with visible results

### **Medium Tasks (Yellow Light 🟡):**
- Combine multiple learned concepts
- Require some research or problem-solving
- May need Claude assistance to complete
- Good balance of challenge and achievability

### **Challenging Tasks (Red Light 🔴):**
- Significant new learning required
- Complex integration or logic
- May take multiple sessions to complete
- Should only suggest if user is confident and energized

---

## 🛡️ Safety Checks Before Proceeding

### **Technical Readiness:**
- ✅ All necessary accounts and APIs are set up
- ✅ Development environment is working properly
- ✅ Previous task dependencies are complete
- ✅ No major blockers or errors present

### **Learning Readiness:**
- ✅ User understands concepts from previous tasks
- ✅ Not too many new concepts introduced at once
- ✅ Clear learning resources available
- ✅ Support available for difficult parts

### **Energy and Time:**
- ✅ User has adequate time for the task
- ✅ Energy level appropriate for task difficulty
- ✅ Not rushing due to external pressures
- ✅ Motivated and excited about the challenge

---

## 🔄 Alternative Paths

### **If User Wants Something Easier:**
```
🌱 No problem! Let's try something simpler first.

Easier alternatives:
1. [Simpler version of suggested task]
2. [Different task that's less complex]
3. [Practice exercise to build confidence]

Which sounds more manageable right now?
```

### **If User Wants More Challenge:**
```
🚀 Feeling ambitious? Great! Here are some stretch options:

Advanced challenges:
1. [More complex version of task]
2. [Additional feature to add]
3. [Creative enhancement idea]

Warning: These will require extra research and patience!
```

### **If Prerequisites Not Met:**
```
⚙️ Let's get you ready first!

Missing prerequisites:
- [Specific requirement and how to meet it]
- [Another requirement and solution]

Once these are sorted (should take about [X] minutes), 
you'll be ready for the next exciting challenge!
```

---

## 🎉 Motivation and Context

### **Connect to Project Vision:**
- Explain how this task helps future travelers
- Show how it fits into the bigger picture
- Highlight unique value being created
- Build excitement about user impact

### **Acknowledge Growth:**
- Compare current task complexity to earlier work
- Highlight new skills being developed
- Recognize increasing developer confidence
- Celebrate problem-solving improvements

### **Build Anticipation:**
- Hint at cool results they'll see
- Mention satisfaction of completing challenge
- Preview what becomes possible after this task
- Create excitement about learning journey

---

## 🎯 Success Criteria

After `/NextTask`, user should:
- ✅ Feel excited and confident about next step
- ✅ Understand exactly what they're building and why
- ✅ Know the first specific action to take
- ✅ Feel appropriately challenged but not overwhelmed
- ✅ See clear connection to project goals

---

## 🔗 Related Commands

- Use `/Status` if user wants to double-check current progress
- Suggest `/Help [concept]` if new concepts need explanation
- Recommend `/Learn [skill]` if significant new learning required
- Offer `/Stuck` pathway if user feels overwhelmed