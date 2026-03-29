# KUHS MCQ DRILL

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Home/Launch page with rotating random motivational quotes and a "Start Drilling" CTA button
- MCQ module: questions organized by modules (Day tabs), each with 4 answer options
- Answer feedback: green highlight for correct, red for wrong + correct answer revealed
- Explanation shown after answering each question
- Admin panel locked by password (Tesla369) — only admins can add/edit/delete questions and modules
- Each module (Day tab) allows adding, saving, editing, and deleting questions with 4 options + explanation
- Red and white theme with black border UI, rounded bold typography (Nunito font)

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Store modules (days), questions (text, 4 options, correct index, explanation), motivational quotes
2. Backend: CRUD APIs for modules and questions
3. Backend: Admin auth via password check (Tesla369)
4. Frontend: Home page with random quote display and Start Drilling button
5. Frontend: MCQ drill view — list modules as tabs, show questions one by one with 4 options
6. Frontend: Answer interaction — tap to select, show green/red, reveal explanation
7. Frontend: Admin panel — password gate, then CRUD UI for modules and questions
8. Red/white theme, black outlines, Nunito rounded bold font throughout
