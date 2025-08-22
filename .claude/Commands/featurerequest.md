# /FeatureRequest Command Specification

## Command Purpose
Systematically process new feature ideas, categorize them by complexity and phase, and integrate them into the project roadmap appropriately.

## Usage
```
/FeatureRequest [feature descriptions]
```

## Input Format Options

### Option 1: List Format
```
/FeatureRequest
- Location weather integration for activity suggestions
- User profile customization with avatar upload
- Export trip to PDF functionality
- Voice search for locations
- Dark mode toggle
```

### Option 2: Natural Description
```
/FeatureRequest I want to add weather-based recommendations, user avatars, and maybe some kind of social sharing feature where people can share their trips.
```

### Option 3: Detailed Format
```
/FeatureRequest
Feature: Weather-based recommendations
Description: When it's raining, suggest indoor activities automatically
Priority: High - would really improve user experience

Feature: User avatars
Description: Let users upload profile photos
Priority: Low - nice to have but not essential
```

## Claude Code Response Process

### Step 1: Feature Analysis
For each feature, Claude should analyze:
- **Complexity Level:** Simple | Medium | Complex
- **Implementation Effort:** 1-2 days | 1 week | 2+ weeks
- **Dependencies:** What existing features/infrastructure needed
- **User Impact:** High | Medium | Low
- **Technical Risk:** Low | Medium | High

### Step 2: Phase Assignment and Roadmap Integration
Based on analysis, assign to appropriate phase using the **"Explora Development Phases - Revised Roadmap"**:

#### **Roadmap Consultation Process:**
1. **Check roadmap document** for current phase objectives and next phase planning
2. **Validate phase capacity** - ensure phase isn't overloaded with features
3. **Verify phase logic** - feature fits with phase theme and success criteria
4. **Update roadmap** if significant feature additions change phase scope

#### **Phase Assignment Rules:**
- **Current Phase** - Only if directly supports existing phase objectives
- **Next Phase** - If requires current phase completion as prerequisite
- **Future Phases** - Based on roadmap complexity and dependency analysis
- **Roadmap Update** - Add to appropriate phase section in roadmap document

### Step 3: Integration Actions

#### **For Current Phase Features:**
1. Add to TODO.md under appropriate priority section
2. Integrate with existing task groupings
3. Set realistic timeline expectations
4. Note any prerequisite tasks needed

#### **For Future Phase Features:**
1. Add to roadmap artifact under correct phase
2. Update success parameters if significant feature
3. Note in CLAUDE.md if affects current phase planning
4. Document in DECISIONS.md if involves tech choices

## Response Template

```markdown
## 🎯 Feature Request Analysis Complete

### ✅ Added to Current Phase (TODO.md):
**[Feature Name]** - [Brief description]
- **Effort:** [Timeline estimate]
- **Priority:** [High/Medium/Low] 
- **Added to:** [Specific TODO.md section]
- **Prerequisites:** [Any dependencies]

### 📅 Scheduled for Future Phases:

#### Phase 4 - User Validation:
**[Feature Name]** - [Why this phase]
- **Complexity:** [Analysis]
- **User Impact:** [Expected benefit]

#### Phase 5+ - Advanced Features:
**[Feature Name]** - [Why later phase]
- **Technical Requirements:** [What's needed first]
- **Dependencies:** [Other features/infrastructure]

### ⚠️ Features Needing Clarification:
**[Feature Name]** - [What questions need answers]
- **Question:** [Specific details needed]
- **Impact on Timeline:** [How uncertainty affects planning]

### 📊 Analysis Summary:
- **Total Features Processed:** [Number]
- **Current Phase:** [Number] features added
- **Future Phases:** [Number] features scheduled
- **Need Discussion:** [Number] features requiring clarification

### 🎯 Recommended Next Actions:
1. [Immediate actions for current phase]
2. [Any decisions needed before implementation]
3. [Questions to resolve for unclear features]
```

## Decision Criteria Examples

### Current Phase Criteria (Add to TODO.md):
```
✅ Weather-based activity suggestions
- Builds on existing tag system
- Simple API integration with OpenWeatherMap
- Direct user value for Belgian weather
- 3-4 days implementation effort

✅ Trip export to PDF
- Uses existing trip data structure
- Standard PDF generation library
- Valuable for offline trip access
- 2-3 days implementation effort
```

### Future Phase Criteria:
```
📅 Phase 4: Social trip sharing
- Requires user validation first
- Medium complexity (sharing infrastructure)
- Depends on user adoption patterns

📅 Phase 5: Voice search integration
- High technical complexity
- Requires speech recognition setup
- Advanced feature beyond core MVP

📅 Phase 6: Real-time collaboration
- Very high complexity
- Needs real-time database architecture
- Significant infrastructure changes
```

## Feature Complexity Assessment

### Simple (1-3 days):
- UI/UX improvements to existing features
- New filters or sorting options
- Basic integrations with existing APIs
- Simple data export/import functions

### Medium (1-2 weeks):
- New feature components
- Third-party service integrations
- Database schema additions
- Cross-feature integrations

### Complex (2+ weeks):
- New major feature areas
- Significant architecture changes
- Real-time functionality
- Advanced AI/ML features
- Mobile app features

## Integration with Existing Workflow

### File Updates After /FeatureRequest:
1. **TODO.md** - Current phase features added with priority
2. **Roadmap Artifact** - Future features added to appropriate phases
3. **CLAUDE.md** - Phase status updated if significant changes
4. **DECISIONS.md** - New tech decisions documented if needed

### Follow-up Commands:
- Use `/Status` to see how new features affect current priorities
- Use `/WeeklyPlan` to integrate new current-phase features
- Use `/Progress` to understand impact on overall timeline

## Example Usage Scenarios

### Scenario 1: User Inspiration
```
User: /FeatureRequest Dark mode, better search filters, and some kind of recommendations engine

Claude Response:
✅ Added to Current Phase:
- Better search filters (2-3 days, builds on existing tag system)

📅 Phase 4:
- Dark mode (needs user preference validation)

📅 Phase 5:
- Recommendations engine (complex AI feature, requires user behavior data)
```

### Scenario 2: Strategic Planning
```
User: /FeatureRequest We need to think about monetization - maybe premium features, business partnerships, and some kind of booking integration

Claude Response:
📅 Phase 6 - Platform Growth:
- Premium features (needs user validation of core features first)
- Business partnerships (requires proven user base)
- Booking integration (complex, needs revenue model validation)

🎯 Recommended: Focus on current phase user validation before monetization features
```

## Success Criteria
- Features correctly categorized by complexity and phase
- Current phase features appropriately added to TODO.md
- Future features enhance roadmap without overwhelming current work
- User maintains focus on current priorities while capturing future ideas
- Systematic approach prevents feature creep and scope explosion