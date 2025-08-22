# /NextTask Command

> **Command Purpose:** Identify and explain the next logical development step

---

## 🎯 When User Types `/NextTask`

### **Claude Should Respond With:**

#### **1. Current Task Completion Verification**
- Confirm previous task is actually complete
- Check current phase work progress and quality
- Ensure proper documentation and progress tracking
- Verify readiness for next challenge in current phase

#### **2. Next Task Identification Based on Current Phase**
- Analyze TODO.md current phase sections for logical progression
- Prioritize based on current phase objectives and success criteria
- Consider current progress toward phase completion targets
- Choose task that advances current phase goals effectively

#### **3. Task Breakdown and Context**
- Break complex task into manageable steps
- Explain how this task advances toward current phase completion
- Estimate time and effort required for solo developer
- Identify relevant skills or concepts to learn

#### **4. Prerequisites and Readiness Check**
- Verify infrastructure ready for current phase work
- Check required tools and resources are available
- Ensure technical components are operational
- Confirm energy level for current phase complexity

---

## 📋 Response Template

```
🚀 Next Task: [Task Name]

🎯 Phase Context: [How this advances current phase objectives]

✅ Prerequisites Check:
- [Required tools/resources ready] ✅/❌
- [Technical infrastructure ready] ✅/❌  
- [Dependencies completed] ✅/❌
- [Skill level appropriate] ✅/❌

📋 What This Task Involves:
1. [Step 1 - specific and achievable]
2. [Step 2 - builds toward phase goals]
3. [Step 3 - completion criteria for phase progress]

🎯 Success Criteria: [How you'll know it advances phase objectives]

🔥 Why This Matters: [How this helps users and phase completion]

📊 Phase Impact: [Progress toward current phase targets]

Ready to advance toward phase completion? Say 'yes' and I'll guide you through step 1!
Type /Stuck if you want to try a simpler task first.
```

---

## 🗺️ Task Selection Logic

### **Priority Framework:**
1. **Phase Completion Dependencies** - Tasks that unlock phase advancement
2. **User Value** - Features that directly help target users  
3. **Technical Foundation** - Infrastructure needed for current phase
4. **Learning Progression** - Skills that build on recent work

### **Phase-Appropriate Progression:**

#### **Early Phase (Foundation):**
- Environment setup and basic functionality
- Core data structures and simple features
- Basic UI components and user flows
- Foundation for more complex work

#### **Development Phase (Building):**
- Advanced features and integrations
- Complex UI/UX implementations
- Database optimization and scaling
- Quality frameworks and validation

#### **Advanced Phase (Optimization):**
- AI/ML features and personalization
- Cultural adaptation and globalization
- Performance optimization and scaling
- Advanced user experience features

---

## 📊 Task Categories by Type

### **Foundation Tasks:**
- Environment configuration and basic setup
- Core data structures and database design
- Basic UI components and user interface
- Essential feature implementations

**Next Task Examples:**
- "Implement core location data structure with validation"
- "Create basic location browsing interface"
- "Set up database architecture for current phase"

### **Enhancement Tasks:**
- Advanced features and complex integrations
- UI/UX improvements and optimization
- Data quality and validation systems
- Performance and scalability improvements

**Next Task Examples:**
- "Add advanced filtering and search functionality"
- "Implement drag-and-drop interface for user interactions"
- "Build recommendation engine with quality scoring"

### **Optimization Tasks:**
- AI/ML integration and personalization
- Cultural adaptation and localization
- Advanced performance optimization
- Global scaling and infrastructure

**Next Task Examples:**
- "Implement AI-powered content suggestions"
- "Add cultural adaptation for international users"
- "Optimize performance for large-scale deployment"

---

## 🎯 Difficulty Progression

### **Foundation Tasks (Building Blocks) 🟢:**
- Single-component implementations
- Basic feature applications using established patterns
- Quality validation for core functionality
- Simple integrations and connections

### **Enhancement Tasks (Integration) 🟡:**
- Multi-component feature implementations
- UX optimization for complex interactions
- Integration between multiple systems
- Phase-specific advanced features

### **Optimization Tasks (Advanced) 🔴:**
- Complex algorithms and AI implementations
- Cultural adaptation and international features
- Cross-system integration and optimization
- Foundation preparation for next phase

---

## 🛡️ Safety Checks

### **Technical Readiness:**
- ✅ Required infrastructure properly implemented
- ✅ Database architecture supports planned work
- ✅ Quality frameworks operational
- ✅ No critical issues blocking progress

### **Phase Readiness:**
- ✅ Current phase prerequisites met
- ✅ Required resources available for phase work
- ✅ Technical complexity appropriate for current phase
- ✅ Understanding of phase objectives clear

### **Development Progression:**
- ✅ Current work aligns with phase success criteria
- ✅ Task advances toward phase completion
- ✅ Work prepares foundation for future phases
- ✅ Complexity appropriate for solo developer constraints

---

## 📄 Alternative Paths

### **If User Wants Simpler Task:**
```
🌱 Let's start with foundational work:

Easier alternatives:
1. [Simpler version focusing on single component]
2. [Basic implementation before advanced features]
3. [Practice task to build confidence]

Which feels more manageable for current progress?
```

### **If User Wants Advanced Challenge:**
```
🚀 Ready for complex challenges:

Advanced options:
1. [Multi-system integration task]
2. [AI/ML powered feature implementation]
3. [Cultural adaptation or optimization work]
```

### **If Prerequisites Not Met:**
```
⚙️ Let's ensure readiness first:

Missing for current phase:
- [Specific infrastructure requirement]
- [Required tool or resource needed]
- [Technical component that needs completion]

Once ready (about [X] time), you'll be set for advancement!
```

---

## 🎯 Success Criteria

After `/NextTask`, user should:
- ✅ Know specific action to take next
- ✅ Understand how task advances current phase
- ✅ Feel appropriately challenged for current phase complexity
- ✅ See clear connection to phase completion goals

---

## 🔗 Related Commands

- Use `/Status` for comprehensive current phase progress review
- Suggest `/Help [topic]` for phase-appropriate concept guidance
- Recommend `/Learn [skill]` for complex technical skills
- Offer `/FeatureRequest` for new phase enhancement ideas
- Use `/ReportIssue` pathway if blockers discovered