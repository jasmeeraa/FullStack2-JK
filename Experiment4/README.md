# Social Media Post Scheduler

This project is a frontend-only academic experiment for demonstrating React state management with a scheduling calendar. It uses a simple React + Vite setup and FullCalendar to visualize social media content across month, week, and day views.

## Purpose

The app shows how structured JavaScript objects can be mapped into calendar events, how drag-and-drop changes application state, and how React re-renders the interface after each state change.

## Technologies used

- React
- Vite
- FullCalendar
- CSS for responsive dashboard styling

## How to run

```bash
npm install
npm run dev
```

Then open the local URL displayed in the terminal.

## How drag-and-drop works

Each scheduled post is stored as an object in React state. FullCalendar converts those objects into calendar events. When an event is dropped to a new date or time, the callback captures the new date and time from the calendar event and updates the matching post with setPosts(). React then re-renders the calendar automatically.

## Why this is frontend-only

This project does not include any backend, database, API, or authentication layer. All post data is kept in local React state and can optionally be persisted with localStorage, but the primary source of truth remains the frontend application itself.

## Demonstration notes

- Create a post from the add-post modal.
- Click a post to edit or delete it.
- Drag an event to a new date/time slot.
- Watch the State Change / Activity Log update.
- Switch among Month, Week, and Day views to compare calendar layouts.
