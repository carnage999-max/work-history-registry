# Work History Registry — Build Prompt (V1)

You are implementing the Work History Registry website. This is infrastructure-grade software UI: neutral, restrained, authority-forward. No startup gimmicks. No HR-blog aesthetic. No consumer-review patterns.

## Non-negotiable UX
- No scoring, no star ratings, no charts, no color-coded judgments.
- Motion only clarifies state transitions (opacity + position only).
- No icons implying judgment, warning, or scoring.
- Timeline is read-only; record fields are immutable in UI.

## Pages (SSR routes)
/
/verify
/employers
/employees
/how-it-works
/legal
/security
/about
/login
/register

## Core components required
- VerificationTimeline (read-only)
- RecordCard (immutable fields)
- DisputeBadge (overlay only)
- EmployerAttestationModal (blocking)
- ConsentGate (mandatory)

## Technical stack
- React + TypeScript
- Server-side rendering (Next.js App Router preferred)
- Design tokens: Slate #1F2937, Graphite #374151, Muted Blue #3B82F6
- Typeface: Inter (400–600), 4px spacing grid
- iOS-style cards, subtle transitions
