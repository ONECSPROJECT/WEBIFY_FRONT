# WEBIFY_FRONT



## Project Overview
The goal of this project is to manage teachers' schedules, periods, and extra class payments. The application automates the calculation of extra hours for teachers based on their approved workdays and ensures accurate payment processing.

---

## Important
- **Authentication:** Both admins and teachers are encapsulated into a single user entity for authentication, ensuring a unified access control system.

---

## Actors
- **Admin**
  - Manages teacher schedules, periods, and payment processing.
- **Teacher**
  - Has read-only access to:
    - Their schedule
    - The period they're in
    - Their grade
    - Their extra paycheck at the end of each period

---

## Admin Workflow

### 1. Schedule Management
- **Task:** The admin fills out the schedule for each teacher.
- **Each schedule entry includes:**
  - **Day**
  - **Hour**
  - **Volume** (of each session)
  - **Session Type:** (Course TD, or TP)

> **Note:** Accurate scheduling is crucial. Any change to a teacher’s schedule triggers a new period, so double-check entries for consistency.

### 2. Period Management
- **Period Table Contains:**
  - `teacherid`
  - The associated schedule ID (`schedid`)
  - **Start Date** and **End Date**
  - **Teacher's Grade** (this is stored here because grade changes affect the period)

- **A new period is triggered when:**
  - The teacher’s grade changes (affecting their coefficient)
  - The schedule is updated (i.e., a change of semester)
  - A new tracking period begins (e.g., after 31-12-2024 for a new academic year)

> **Warning:** Changes in the teacher's grade or schedule directly affect period tracking and payment calculations.  
> **Note:**  
> - The change of schedule is equivalent to a change of semester.  
> - You can use an `end_date = null` column to indicate an open period, or assume that the last period is the active one, since a teacher should not be in two different periods simultaneously.

### 3. State-Based Extra Hours Calculation

#### External Teachers
- **Rule:** If a teacher's state is **external** (from another school), then **all** the courses and TD/TP they perform at our school are considered extra.
  
> **Caution:** Misclassifying a teacher’s state (internal vs. external) can lead to incorrect extra hour calculations and payment errors. Always verify the teacher's state before processing.

#### Internal Teachers
- **Standard Workload:** 9 hours per week.
- **Session Coefficients:**
  - **Course:** 1.5
- **Calculation:**  
  The weighted sum of the hours is computed. Any hours above the standard 9 are considered extra hours.

> **Example Calculations:**

- **Teacher A:**
  - **Schedule:**
    - **Sunday:** 3 hours of course, 2 hours of lab work.
    - **Monday:** 1 hour of course, 2 hours of lab work.
    - **Tuesday:** 2 hours of course, 1 hour of lab work.
  - **Operation:**
    - Total course hours = 6 hours.  
      → Extract these 6 course hours (distributed across Sunday, Monday, and Tuesday) and retain only the lab work hours as extra.

- **Teacher B:**
  - **Schedule:**
    - **Sunday:** 3 hours of course, 1 hour of lab work.
    - **Monday:** 2 hours of course, 4 hours of lab work.
    - **Tuesday:** 2 hours of course, 1 hour of lab work.
  - **Operation:**
    - With total course hours exceeding 6 (since 6 × 1.5 = 9), extract only 6 hours of course from the total.  
      → The remaining 1 hour of course and the lab work hours are retained as extra.

- **Teacher C:**
  - **Schedule:**
    - **Sunday:** 1 hour of course.
    - **Monday:** 2 hours of course and 3 hours of lab work.
    - **Tuesday:** 3 hours of lab work only.
  - **Operation:**
    - Total course hours are less than 5. Multiply the course hours by 1.5 (e.g., 3 hours × 1.5 = 4.5), then add 4.5 hours of lab work to reach the standard 9 hours.  
      → The remaining 1.5 hours of lab work are counted as extra.
  - **Priority Rule:**  
    Extra hours are prioritized from early sessions over later ones. In this case, the extra 1.5 hours from Tuesday are considered rather than from Monday.

> **Important:** Ensure that the coefficients are correctly applied to avoid miscalculations, as accuracy is crucial for proper compensation.

---

## Design Considerations
- **Redundancy vs. Implicit Data:**
  - One suggestion was to add a flag to indicate whether a session is extra. However, since the operation involves only retaining the extra hours, every remaining session implicitly represents extra time.
  - **Conclusion:** Using an explicit flag is redundant and may add unnecessary overhead, as the calculation already inherently differentiates between regular and extra hours.

- **Calculation Consistency:**
  - It is essential to prioritize early sessions over later ones to maintain fairness and accuracy in the extra hour calculation process.

---
