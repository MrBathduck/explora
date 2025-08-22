# 🔐 Firebase Security Rules Plan

> **Purpose:** Secure Explora's Firebase backend with proper access controls  
> **Current Status:** Planning Phase  
> **Priority:** High (user data protection)  
> **Last Updated:** January 2025

---

## 🎯 Security Objectives

### **Primary Goals**
- **User Data Isolation:** Users can only access their own data
- **Authentication Required:** No anonymous access to personal data
- **Data Validation:** Ensure data integrity and prevent malicious inputs
- **Read/Write Permissions:** Granular control over data operations

### **Current Data Collections**
Based on code analysis, Explora uses these Firestore collections:
- `userFavorites` - User's favorite locations
- `userTrips` - User's trip data and itineraries
- Future: `userProfiles`, `locations`, `reviews`

---

## 📊 Current Data Structure Analysis

### **Collection: `userFavorites`**
```typescript
// Document ID: {userId}
{
  userId: string,           // Matches auth user ID
  favorites: string[],      // Array of location IDs
  updatedAt: Date          // Last modification time
}
```

**Security Requirements:**
- ✅ **Read:** Only by document owner
- ✅ **Write:** Only by document owner
- ✅ **Validate:** userId matches auth.uid
- ✅ **Schema:** Enforce required fields

### **Collection: `userTrips`**
```typescript
// Document ID: trip_{timestamp}_{random}
{
  id: string,              // Trip identifier
  userId: string,          // Owner's auth ID
  name: string,            // Trip name
  startDate: string,       // ISO date string
  endDate: string,         // ISO date string
  itinerary: ItineraryDay[], // Daily plans
  createdAt: Date,         // Creation time
  updatedAt: Date          // Last modification
}
```

**Security Requirements:**
- ✅ **Read:** Only trips owned by authenticated user
- ✅ **Write:** Only by trip owner
- ✅ **Delete:** Only by trip owner
- ✅ **Validate:** userId matches auth.uid, valid dates

---

## 🛡️ Security Rules Structure

### **Base Security Template**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions for reuse
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isValidUserData() {
      return request.resource.data.userId == request.auth.uid;
    }
    
    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### **User Favorites Security**
```javascript
// Rules for userFavorites collection
match /userFavorites/{userId} {
  // Allow read/write only if user owns the document
  allow read, write: if isOwner(userId);
  
  // Validate data on create/update
  allow create: if isOwner(userId) 
    && isValidUserData()
    && request.resource.data.keys().hasAll(['userId', 'favorites', 'updatedAt'])
    && request.resource.data.favorites is list
    && request.resource.data.updatedAt is timestamp;
    
  allow update: if isOwner(userId) 
    && isValidUserData()
    && request.resource.data.diff(resource.data).affectedKeys()
       .hasOnly(['favorites', 'updatedAt']);
}
```

### **User Trips Security**
```javascript
// Rules for userTrips collection  
match /userTrips/{tripId} {
  // Allow read/write only by trip owner
  allow read, write: if isAuthenticated() 
    && resource.data.userId == request.auth.uid;
    
  // Validate new trip creation
  allow create: if isAuthenticated()
    && request.resource.data.userId == request.auth.uid
    && request.resource.data.keys().hasAll([
      'id', 'userId', 'name', 'startDate', 'endDate', 
      'itinerary', 'createdAt', 'updatedAt'
    ])
    && request.resource.data.name is string
    && request.resource.data.name.size() > 0
    && request.resource.data.startDate is string
    && request.resource.data.endDate is string;
    
  // Validate trip updates
  allow update: if isAuthenticated()
    && resource.data.userId == request.auth.uid
    && request.resource.data.userId == request.auth.uid;
}
```

---

## 🔧 Implementation Strategy

### **Phase 1: Basic Security (Immediate)**
1. **Deploy base rules** with user isolation
2. **Test current functionality** works with rules
3. **Verify no unauthorized access** possible
4. **Monitor Firebase console** for rule violations

### **Phase 2: Data Validation (Week 2)**
1. **Add field validation** for all collections
2. **Implement schema enforcement** 
3. **Add data type checking**
4. **Test edge cases and malicious inputs**

### **Phase 3: Advanced Security (Month 2)**
1. **Add rate limiting** for writes
2. **Implement cascading deletes**
3. **Add audit logging**
4. **Performance optimization** of rules

---

## 📁 File Structure for Security Rules

### **Recommended Organization**
```
firebase/
├── firestore.rules          # Main security rules file
├── storage.rules           # Future: File upload security
├── firebase.json           # Firebase configuration
└── security/
    ├── userFavorites.rules # Individual collection rules
    ├── userTrips.rules     # Trip-specific rules
    ├── helpers.rules       # Reusable functions
    └── test-rules.js       # Security rule testing
```

### **Development Workflow**
```bash
# Test rules locally
firebase emulators:start --only firestore

# Deploy rules to production  
firebase deploy --only firestore:rules

# Monitor rule usage
firebase firestore:rules:get
```

---

## 🧪 Security Testing Plan

### **Test Cases to Implement**

#### **Authentication Tests**
- ✅ Unauthenticated users cannot read/write any data
- ✅ Users can only access their own userFavorites
- ✅ Users can only access their own userTrips
- ✅ Cross-user data access is blocked

#### **Data Validation Tests**
- ✅ Invalid userId in document is rejected
- ✅ Missing required fields are rejected
- ✅ Wrong data types are rejected
- ✅ Malicious payloads are blocked

#### **Edge Case Tests**
- ✅ Empty arrays/objects handled correctly
- ✅ Very large favorites lists are limited
- ✅ Date validation for trip start/end
- ✅ Nested itinerary data validation

### **Testing Tools**
```javascript
// Example security rule test
import { assertSucceeds, assertFails } from '@firebase/rules-unit-testing';

test('Users can read their own favorites', async () => {
  const db = getFirestore(getAuthedApp('user1'));
  await assertSucceeds(
    getDoc(doc(db, 'userFavorites', 'user1'))
  );
});

test('Users cannot read others favorites', async () => {
  const db = getFirestore(getAuthedApp('user1'));
  await assertFails(
    getDoc(doc(db, 'userFavorites', 'user2'))
  );
});
```

---

## 🚨 Security Best Practices

### **Current Implementation Review**

#### **✅ Good Practices Already Used**
- **Document IDs match user IDs** for favorites
- **UserId validation** in data structure  
- **Error handling** for failed operations
- **No sensitive data** stored in client-side code

#### **🟡 Areas for Improvement**
- **No server-side validation** currently
- **No rate limiting** on writes
- **Minimal input sanitization**
- **No audit trail** for data changes

#### **⚠️ Security Risks to Address**
- **Open Firestore rules** (default allow)
- **No data type validation**
- **No size limits** on arrays/strings
- **No protection** against data deletion

---

## 🔄 Migration Plan

### **Current State: Development Mode**
```javascript
// CURRENT RULES (INSECURE - DEVELOPMENT ONLY)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // DANGEROUS!
    }
  }
}
```

### **Target State: Production Security**
```javascript
// SECURE RULES (PRODUCTION READY)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Specific, secure rules for each collection
    match /userFavorites/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    match /userTrips/{tripId} {
      allow read, write: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 📋 Implementation Checklist

### **Immediate Actions (This Week)**
- [ ] Create `firestore.rules` file with basic security
- [ ] Test rules don't break current functionality
- [ ] Deploy rules to Firebase project
- [ ] Verify security in Firebase console

### **Short-term Actions (Next 2 Weeks)**
- [ ] Add comprehensive data validation
- [ ] Implement security rule testing
- [ ] Add rate limiting and size constraints
- [ ] Create backup/recovery procedures

### **Long-term Actions (Month 2)**
- [ ] Add audit logging for data changes
- [ ] Implement advanced security monitoring
- [ ] Create security documentation for team
- [ ] Regular security rule reviews

---

## 🎯 Success Metrics

### **Security Indicators**
- ✅ **Zero unauthorized data access** in Firebase logs
- ✅ **All current functionality** works with rules
- ✅ **Rule violations logged** and blocked
- ✅ **Fast query performance** maintained

### **Compliance Targets**
- 🎯 **GDPR Ready:** User data isolation and deletion
- 🎯 **SOC 2 Type II:** Audit trails and access controls  
- 🎯 **Production Ready:** Enterprise-grade security

---

*This security plan balances user data protection with development velocity, ensuring Explora is ready for production deployment with enterprise-grade security.*