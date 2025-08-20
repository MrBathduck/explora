# 🤖 CLAUDE.md - AI Assistant Context & Project Status

> **Last Updated:** January 2025  
> **Project Phase:** Phase 0 - Documentation & Setup  
> **Next Milestone:** Development Environment Setup

---

## 📋 Project Overview

### **Project Identity**
- **Name:** Explora
- **Vision:** AI-powered travel planning that ends decision fatigue with privacy-first, real-time adaptation
- **Core Value:** "Your smart city guide that learns your style while respecting your privacy"

### **Target Market**
- **Primary:** European city travelers (tourists + locals exploring)
- **Demographics:** Privacy-conscious, tech-savvy, values authentic experiences
- **Pain Point:** Decision paralysis from too many travel options online

### **Current Development Phase**
📍 **Phase 0: Documentation & Setup** (Pre-development)
- Setting up comprehensive documentation suite
- Preparing development environment
- Finalizing MVP feature scope

---

## 👨‍💻 Solo Developer Context

### **Developer Profile** (Reference: `00-CORE-INSTRUCTIONS-Solo-Developer-Guide.md`)
- **Type:** "Vibe coder" (enthusiastic but not professional developer)
- **Constraints:** Limited time, budget, and technical depth
- **Strengths:** Quick learner, user-focused thinking, resourceful
- **Reality Check:** Building alone initially, need to keep things simple

### **Technology Decisions Made**
```
✅ Frontend: React (familiar territory)
✅ Backend: Firebase (no server management needed)
✅ Database: Firestore (NoSQL, easy to start)
✅ Hosting: Netlify/Vercel (free tier)
✅ Maps: Google Maps API (straightforward integration)
```

### **Development Approach**
- **Philosophy:** "Do things that don't scale" for MVP
- **Strategy:** Ultra-lean solo MVP → validate → iterate
- **Timeline:** 6-8 months to functional MVP
- **Success Metric:** 100 users in pilot city

---

## 🖥️ Claude Code Integration

### **Development Environment**
- **Primary Interface:** Claude Code CLI for hands-on development
- **Secondary Interface:** Web Claude for strategic planning and documentation
- **Workflow:** Hybrid approach with seamless context handoff between environments

### **Claude Code Specific Instructions**
- **Focus:** Terminal-based development guidance with direct file manipulation
- **Style:** Concise, actionable guidance optimized for CLI workflow
- **Context:** Maintain project state awareness across both environments
- **Integration:** Reference web Claude documentation while providing hands-on coding assistance

### **Environment-Specific Roles**

#### **For Claude Code Sessions:**
- **Primary Use:** Active development, file editing, debugging, testing
- **Communication:** Direct, concise responses focused on immediate coding tasks
- **File Operations:** Edit, create, and manage project files directly
- **Problem Solving:** Real-time assistance with code issues and implementation

#### **For Web Claude Sessions:**
- **Primary Use:** Strategic planning, comprehensive documentation, learning
- **Communication:** Detailed explanations and educational content
- **Documentation:** Maintain and update project documentation suite
- **Planning:** High-level architecture decisions and roadmap planning

---

## 🤖 AI Assistant Instructions

### **How Claude Should Help**

**🎯 Communication Style:**
- **Be practical, not academic** - focus on "what to build next"
- **Explain complex concepts simply** - remember I'm learning as I go
- **Provide working code examples** - not just theory
- **Encourage and motivate** - solo development can be isolating
- **Adapt to environment** - concise in CLI, detailed in web interface

**📚 Learning Focus Areas:**
1. **React best practices** for travel app UI/UX
2. **Firebase integration** - auth, database, hosting
3. **Google Maps API** implementation and optimization
4. **Mobile-responsive design** patterns
5. **Performance optimization** for image-heavy travel content

**🚫 What NOT to Do:**
- Don't suggest complex microservices architecture
- Don't recommend technologies not in my stack
- Don't over-engineer solutions
- Don't assume I know advanced development concepts
- Don't duplicate work between environments

### **Code Assistance Preferences**
```javascript
// ✅ GOOD: Simple, commented, working example
const LocationCard = ({ location }) => {
  // Show location with image and basic info
  return (
    <div className="location-card">
      <img src={location.image} alt={location.name} />
      <h3>{location.name}</h3>
      <p>{location.description}</p>
    </div>
  );
};

// ❌ AVOID: Complex patterns without explanation
const LocationCard = memo(forwardRef(({ location, onSelect, ...props }, ref) => {
  // Complex implementation without context
}));
```

---

## 📊 Current Status Tracking

### **Development Phase Status**
```
Phase 0: Documentation & Setup    🔄 IN PROGRESS
├── Project documentation         ✅ COMPLETE
├── Development environment       📋 TODO
├── Firebase project setup        📋 TODO
└── Initial React app creation    📋 TODO

Phase 1: Core Foundation         📋 UPCOMING
├── Location database setup       ⏸️ WAITING
├── Basic UI components           ⏸️ WAITING
├── Google Maps integration       ⏸️ WAITING
└── User authentication           ⏸️ WAITING
```

### **Next Milestones**
1. **This Week:** Complete documentation suite
2. **Next Week:** Set up development environment
3. **Week 3-4:** Build first working prototype
4. **Month 2:** Have basic location browsing working

### **Achievement Log**
```
🎉 Achievements Unlocked:
[Empty - first entry will be completing documentation]

📈 Metrics to Track:
- Features completed
- User feedback received
- Performance improvements
- Learning milestones reached
```

---

## ⚡ Available Commands

### **Daily Workflow Commands**
```
/StartDay              # Morning orientation and goal setting
/Status                # Current progress and next steps
/TaskCompleted [task]  # Verify completed work quality
/NextTask              # Identify next logical step
/Concerns              # Quality check and issue identification
```

### **Problem-Solving Commands**
```
/Stuck [problem]       # Get immediate help when blocked
/Help [topic]          # Explain concepts in simple terms
/Explain [code/error]  # Break down code or error messages
```

### **Progress Tracking Commands**
```
/Progress              # Comprehensive project overview
/Update [what changed] # Update documentation automatically
/Skills                # Assess learning and skill development
/Celebrate             # Acknowledge achievements and build motivation
```

### **Planning & Strategy Commands**
```
/WeeklyPlan           # Plan upcoming week's priorities
/Learn [skill]        # Create personalized learning plans
/Research [topic]     # Investigate new features or technologies
/Compare [options]    # Help decide between different approaches
```

### **Quality & Maintenance Commands**
```
/Review               # Comprehensive code quality review
/MobileCheck          # Verify mobile-friendliness
/Performance          # Check app speed and efficiency
/Backup               # Guide through proper work saving
/Deploy               # Help publish app online
```

### **Support & Motivation Commands**
```
/Motivation           # Get encouragement and perspective
/Break                # Healthy break reminders and return guidance
```

### **Command File Location**
All command specifications are stored in `.claude/commands/` folder for easy reference and consistency.

---

## 🗺️ Phase Roadmap Summary

### **Ultra-Lean Solo MVP (Months 1-8)**
```
🎯 Goal: Prove the concept works with real users

Core Features:
├── 📍 Location Discovery (50-100 spots per city)
├── 🏷️ Basic Mood Matcher (4 simple moods)
├── 📅 Simple Itinerary Generator
├── 🗺️ Google Maps integration
└── 💾 Basic save/load functionality
```

### **Wave 1: Foundation (Months 8-12)**
```
🎯 Goal: 500+ users, basic community features

Additions:
├── 👥 User accounts and profiles
├── ⭐ Review system (local vs traveler)
├── 🔄 Real-time sync across devices
└── 📱 Mobile app (React Native)
```

### **Future Waves (Year 2+)**
```
Wave 2: Intelligence (AI recommendations, learning)
Wave 3: Community (social features, gamification)
Wave 4: Platform (events, bookings, partnerships)
```

### **Current Focus: MVP Validation**
- **Success Criteria:** 100 active users in pilot city
- **Key Metric:** 70% user retention after first itinerary
- **Timeline:** 6 months to launch, 2 months to validate

---

## 🎛️ Development Workflow

### **Daily Development Session**
1. **Start with `/StartDay`** for orientation and daily goals
2. **Use problem-solving commands** (`/Stuck`, `/Help`, `/Explain`) as needed
3. **Verify completed work** with `/TaskCompleted [task name]`
4. **Get next steps** with `/NextTask`
5. **Update progress** with `/Update [accomplishment]`
6. **Save work safely** with `/Backup`

### **Weekly Planning**
1. **Plan the week** with `/WeeklyPlan`
2. **Check overall progress** with `/Progress`
3. **Assess skill development** with `/Skills`
4. **Celebrate achievements** with `/Celebrate`

### **Problem-Solving Process**
1. **Get unstuck immediately** with `/Stuck [specific problem]`
2. **Learn concepts** with `/Help [topic]`
3. **Debug issues** with `/Explain [error message]`
4. **Check for problems** with `/Concerns`
5. **Get motivation** with `/Motivation` when needed

---

## 🎯 Success Enablers

### **What Makes This Project Succeed**
- **Realistic scope** - building only what's essential
- **AI-assisted learning** - getting help when stuck
- **Progress tracking** - maintaining motivation
- **User-focused** - solving real problems simply

### **Early Warning Signs**
- 🚨 **Scope creep** - adding features before MVP validation
- 🚨 **Tech complexity** - choosing advanced solutions unnecessarily
- 🚨 **Perfectionism** - polishing instead of shipping
- 🚨 **Isolation** - not getting user feedback early

---

## 📞 Emergency Context Reset

**If Claude needs quick context:**
- **Project:** Explora travel app, solo developer, pre-development phase
- **Stack:** React + Firebase + Google Maps, simple and pragmatic
- **Goal:** MVP with 100 users in 6 months
- **Style:** Practical help for learning vibe coder
- **Current:** Setting up documentation before coding starts

---

*This document is the source of truth for AI assistance context. Update it as the project evolves to maintain effective collaboration.*