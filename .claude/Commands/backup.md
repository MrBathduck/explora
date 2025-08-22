# /Backup Command

> **Command Purpose:** Guide through proper work saving

---

## 🎯 When User Types `/Backup`

### **Claude Should:**
1. **Check current status** - Detect unsaved changes and last backup time
2. **Guide Git process** - Provide step-by-step commit instructions
3. **Generate commit message** - Create meaningful message based on recent work
4. **Verify backup success** - Confirm changes were saved properly
5. **Explain importance** - Reinforce backup habits for solo developers

---

## 📋 Response Template

```
💾 Backup Guide: Saving Your Work

📋 Current Status:
- Unsaved changes: [Yes/No - files detected]
- Last backup: [X hours/days ago]

🔄 Backup Steps:
1. `git add .` (Stage all changes)
2. `git commit -m "[Generated message]"`
3. `git push` (Send to cloud backup)

💬 Suggested Commit Message:
"[Auto-generated based on recent work]"

✅ Next Steps:
[Verification commands or success confirmation]

🛡️ Why This Matters: [Brief backup importance reminder]

Your work will be safely saved! 🎉
```

---

## 🔍 Smart Backup Detection

### **Status Analysis:**
- **Detect file changes** - Check for modified, new, or deleted files
- **Estimate last backup** - Reference Git history for last commit time
- **Assess work value** - Determine if changes are significant enough to backup
- **Check repository status** - Verify Git is properly configured

### **Commit Message Generation:**
- **Feature work** → "Add [feature name] functionality"
- **Bug fixes** → "Fix [issue description]" 
- **Documentation** → "Update documentation for [topic]"
- **Research** → "Add research findings for [area]"
- **Refactoring** → "Refactor [component] for better [improvement]"

---

## 📊 Examples

### **Active Development Session:**
```
User: /Backup

Response:
💾 Backup Guide: Saving Your Work

📋 Current Status:
- Unsaved changes: Yes (3 modified files, 1 new file)
- Last backup: 2 hours ago

🔄 Backup Steps:
1. `git add .`
2. `git commit -m "Add location search filtering functionality"`
3. `git push origin main`

💬 Suggested Commit Message:
"Add location search filtering functionality"

✅ Next Steps:
Run the commands above, then type `git status` to verify

```

### **No Changes Detected:**
```
User: /Backup

Response:
💾 Backup Status: All Up to Date

📋 Current Status:
- Unsaved changes: No changes detected
- Last backup: 30 minutes ago

✅ Your work is already safely backed up!

🔄 Good backup habits:
- Save after completing features
- Backup before trying risky changes  
- Commit frequently during active development

Keep up the great work! 🌟
```

## 🎯 Success Criteria
- User understands current backup status
- Clear instructions provided for saving work
- Meaningful commit messages generated
- Backup importance reinforced without being preachy