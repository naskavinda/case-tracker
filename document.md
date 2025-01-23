**Requirements Document for React Native Mobile App: Lawsuit Tracker**

**1. Objective:**
Develop a React Native mobile application for Android to track lawsuits, manage their next scheduled dates, and ensure actions associated with these lawsuits are completed with timely reminders.

---

**2. Features and Functionalities:**

### 2.1. Lawsuit Management
- **Lawsuit Number Input:**
  - A field to input a unique lawsuit number.
  - Validation: Ensure the lawsuit number is non-empty and unique.

- **Next Date Field:**
  - A field to input the next scheduled date for the lawsuit.
  - Validation: Ensure the date is in the future.

### 2.2. Action Tracking
- **Checkbox Selection:**
  - A list of predefined actions related to the lawsuit (e.g., "Document Preparation," "Client Communication," "Court Submission").
  - Users can select multiple actions using checkboxes.

- **UI for Adding Actions:**
  - Provide a user interface to add, edit, or delete actions from the predefined list.
  - Validation: Ensure action names are unique and non-empty.

- **Days Count Input:**
  - Each action will have an associated days count to indicate when the action must be completed.
  - Automatically calculate the due date for each action based on the starting date (i.e., the date of the lawsuit entry).

### 2.3. Reminder System
- **Reminder Mechanism:**
  - Generate reminders for each action and the next lawsuit date.
  - Provide 3 reminders:
    1. **First Reminder:** 7 days before the action’s due date.
    2. **Second Reminder:** 3 days before the due date.
    3. **Final Reminder:** On the due date.
  
- **Notification Delivery:**
  - Send push notifications to the user’s device for each reminder.

### 2.4. Dashboard
- **Lawsuit Overview:**
  - Display a list of all lawsuits with their next date and action statuses.
  - Color-coded indicators:
    - Green: No pending actions.
    - Yellow: Upcoming reminders.
    - Red: Overdue actions or next lawsuit date.

- **Search Functionality:**
  - Search lawsuits by number or next date.

### 2.5. Settings
- **Notification Preferences:**
  - Enable/Disable push notifications.

- **Default Reminder Intervals:**
  - Allow users to customize the reminder intervals (default is 7, 3, and 0 days).

---

**3. Technical Specifications:**

### 3.1. Development Stack
- **Frontend:** React Native
- **Backend:** Node.js or Firebase for managing lawsuit data and reminders
- **Database:** Firebase Firestore or SQLite (for local data storage)
- **Notifications:** Firebase Cloud Messaging (FCM) or Expo Notifications

### 3.2. Data Model
- **Lawsuit:**
  - `lawsuitNumber`: String (unique, required)
  - `nextDate`: Date
  - `actions`: Array of objects
    - `actionName`: String
    - `daysCount`: Integer
    - `dueDate`: Date (calculated based on `daysCount` and starting date)
    - `isCompleted`: Boolean

- **Reminders:**
  - `reminderId`: String
  - `lawsuitNumber`: String (reference to Lawsuit)
  - `actionName`: String
  - `reminderDate`: Date
  - `isSent`: Boolean

- **Action List:**
  - `actionName`: String (unique, required)

---

**4. User Interface Requirements:**

### 4.1. Home Screen
- **Input Fields:**
  - Lawsuit Number
  - Next Date

- **Action Checklist:**
  - List of predefined actions with checkboxes and days count inputs.
  - Include an "Add Action" button to open a modal or screen for managing actions.

### 4.2. Action Management Screen
- **Add/Edit/Delete Actions:**
  - A screen or modal to manage the predefined list of actions.
  - Inputs for action name and default days count.

### 4.3. Dashboard Screen
- **List of Lawsuits:**
  - Display lawsuit numbers, next dates, and action statuses.

- **Search Bar:**
  - Filter lawsuits by number or next date.

### 4.4. Reminder Notifications
- Push notifications displaying:
  - Action Name
  - Due Date

### 4.5. Settings Screen
- Options to customize notification preferences and reminder intervals.

---

**5. Non-Functional Requirements:**
- **Performance:**
  - Ensure the app performs smoothly for up to 500 active lawsuits.

- **Security:**
  - Use secure storage for sensitive data like lawsuit numbers.

- **Scalability:**
  - Design the architecture to support future iOS implementation.

---

**6. Acceptance Criteria:**
- Users can successfully add, view, and manage lawsuits.
- Notifications are delivered as per the configured reminder intervals.
- All actions and reminders are displayed accurately on the dashboard.
- The app should pass QA testing with no major bugs.

---

**7. Deliverables:**
- Fully functional React Native app for Android.
- Source code repository with documentation.
- Deployment package (APK file).

---

**8. Timeline:**
- **Week 1:** Finalize UI/UX design and set up the development environment.
- **Week 2-3:** Implement core functionalities (lawsuit management, action tracking).
- **Week 4:** Integrate reminders and notifications.
- **Week 5:** Develop dashboard and settings screens.
- **Week 6:** Testing and deployment.

---

**9. Risks and Mitigation:**
- **Delayed Notifications:** Ensure FCM integration is thoroughly tested.
- **Data Loss:** Implement backup mechanisms for the database.
- **Scalability Issues:** Use efficient database queries and optimize app performance.

---

**10. References:**
- React Native Documentation
- Firebase Cloud Messaging Documentation

