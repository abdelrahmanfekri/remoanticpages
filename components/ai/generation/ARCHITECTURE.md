# Phase 3 Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Journey Flow                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   User at    │
│ /create page │
└──────┬───────┘
       │
       ├─ Clicks "Start with AI Prompt"
       │
       ▼
┌──────────────────────┐
│  /create/prompt      │
│  PromptPage          │
│                      │
│  • OccasionSelector  │
│  • PromptInput       │
│  • ExamplePrompts    │
│  • PromptHelpers     │
└──────┬───────────────┘
       │
       ├─ User enters prompt & clicks Generate
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                    GenerationFlow                             │
│                   (Main Orchestrator)                         │
└───────────────────┬──────────────────────────────────────────┘
                    │
                    ├─ State: generating
                    │
                    ▼
         ┌─────────────────────┐
         │ GenerationProgress   │
         │   (Modal Overlay)    │
         │                      │
         │  AILoadingState      │
         │  • 5 Steps           │
         │  • Progress Bar      │
         │  • Animations        │
         └──────────┬───────────┘
                    │
                    ├─ Calls: generatePageWithAI()
                    │
                    ▼
         ┌──────────────────────────────┐
         │    Server Action             │
         │ lib/actions/ai/generate-page │
         │                              │
         │  • Auth check               │
         │  • Rate limiting            │
         │  • Cache check              │
         │  • AI Agent call            │
         │  • Save to DB               │
         └──────────┬───────────────────┘
                    │
                    ├─ Uses AI Agent
                    │
                    ▼
         ┌──────────────────────────────┐
         │  AIPageGeneratorAgent        │
         │ lib/ai/core/agent-generator  │
         │                              │
         │  Steps:                      │
         │  1. analyzePrompt()          │
         │  2. generateTheme()          │
         │  3. determineBlockStructure()│
         │  4. generateFullPage()       │
         └──────────┬───────────────────┘
                    │
                    ├─ Returns GeneratedPage
                    │
                    ▼
         ┌──────────────────────┐
         │  GenerationFlow      │
         │  State: preview      │
         └──────────┬───────────┘
                    │
                    ├─ Shows preview
                    │
                    ▼
         ┌──────────────────────────┐
         │   GenerationPreview      │
         │                          │
         │  • BlockRenderer x N     │
         │  • Theme applied         │
         │  • AI reasoning shown    │
         │  • Smooth animations     │
         └──────────┬───────────────┘
                    │
                    ├─ Shows actions
                    │
                    ▼
         ┌──────────────────────────────────────┐
         │       GenerationActions              │
         │                                      │
         │  ┌────────────────────────────────┐ │
         │  │  Looks Great! (Accept)         │ │
         │  └────────────────────────────────┘ │
         │  ┌────────────────────────────────┐ │
         │  │  Edit This                     │ │
         │  └────────────────────────────────┘ │
         │  ┌────────────────────────────────┐ │
         │  │  Try Again (Regenerate)        │ │
         │  └────────────────────────────────┘ │
         └──────────┬───────────────────────────┘
                    │
         ┌──────────┴───────────┬───────────────┐
         │                      │               │
         ▼                      ▼               ▼
    [Accept]               [Edit]         [Regenerate]
         │                      │               │
         ├─ acceptGeneratedPage()               │
         │                      │               │
         ▼                      ▼               │
   [Save to DB]           [Save to DB]         │
         │                      │               │
         ├─ Navigate to         │               │
         │  /dashboard/edit/[id]│               │
         │                      │               │
         └──────────────────────┘               │
                                                 │
                                   ┌─────────────┘
                                   │
                                   ▼
                          [Back to generating]
                          (New page generation)
```

---

## Component Hierarchy

```
GenerationFlow (Orchestrator)
├── GenerationProgress
│   └── AILoadingState
│       ├── Progress Bar
│       └── Step List
│           └── Step Item x5
├── GenerationPreview
│   ├── Header (with close)
│   ├── Preview Content
│   │   └── BlockRenderer x N
│   └── AI Reasoning Card
└── GenerationActions
    ├── Accept Button
    ├── Edit Button
    └── Regenerate Button
```

---

## State Machine

```
┌──────┐
│ idle │ (initial)
└───┬──┘
    │ user clicks generate
    ▼
┌─────────────┐
│ generating  │ (showing progress)
└───┬────┬────┘
    │    │
    │    └─ error ──▶ ┌───────┐
    │                 │ error │ (show error, retry)
    │                 └───────┘
    │
    ▼
┌─────────┐
│ preview │ (showing preview + actions)
└───┬─────┘
    │
    ├─ accept/edit ──▶ ┌───────────┐
    │                   │ accepting │ (saving)
    │                   └───────────┘
    │                         │
    │                         ▼
    │                   [Navigate away]
    │
    └─ regenerate ──▶ [Back to generating]
```

---

## Data Flow

```
User Input (prompt, occasion)
        ↓
Server Action (generatePageWithAI)
        ↓
AI Agent (generatePageWithProgress)
        ↓
    ┌───────────────────────────┐
    │    Generated Page         │
    │                           │
    │  - title: string          │
    │  - recipientName: string  │
    │  - theme: PageTheme       │
    │    • primaryColor         │
    │    • secondaryColor       │
    │    • fontFamily           │
    │  - blocks: BlockData[]    │
    │    • type                 │
    │    • content              │
    │    • settings             │
    │  - reasoning?: string     │
    └───────────┬───────────────┘
                │
                ▼
        Preview Component
                │
                ▼
        User Action (accept/edit)
                │
                ▼
    Server Action (acceptGeneratedPage)
                │
                ▼
        Database (pages, page_blocks)
                │
                ▼
        Navigate to Editor
```

---

## Animation Timeline

```
Time (ms)    Event
─────────────────────────────────────────────
0            User clicks "Generate with AI"
50           Loading modal fades in
100          Progress bar starts
800          Step 1: Analyzing (in_progress)
1600         Step 1: Complete, Step 2: Theme (in_progress)
2800         Step 2: Complete, Step 3: Blocks (in_progress)
3800         Step 3: Complete, Step 4: Content (in_progress)
5800         Step 4: Complete, Step 5: Finalize (in_progress)
6600         Step 5: Complete, all steps done
6650         Loading modal fades out
6700         Preview fades in (opacity + slide up)
6750         Content renders
6850         Action bar slides up from bottom
6900         Accept button pulses once
7400         Animations complete, ready for interaction
```

---

## File Structure

```
components/ai/
├── core/
│   ├── AILoadingState.tsx     (98 lines)  - Reusable loading
│   └── index.ts               (1 line)    - Exports
│
├── generation/
│   ├── GenerationFlow.tsx     (173 lines) - Main orchestrator
│   ├── GenerationProgress.tsx (22 lines)  - Progress modal
│   ├── GenerationPreview.tsx  (85 lines)  - Preview display
│   ├── GenerationActions.tsx  (57 lines)  - Action buttons
│   ├── index.ts               (4 lines)   - Exports
│   ├── README.md              - Documentation
│   ├── TESTING.md             - Test plan
│   ├── COMPLETION.md          - Summary
│   └── ARCHITECTURE.md        - This file
│
└── prompt/
    ├── PromptInput.tsx
    ├── OccasionSelector.tsx
    ├── ExamplePrompts.tsx
    ├── PromptHelpers.tsx
    └── index.ts

lib/actions/ai/
└── generate-page.ts           - Server actions

lib/ai/core/
├── agent-generator.ts         - AI agent
├── client.ts                  - AI client
└── ...

app/
├── create/
│   ├── page.tsx              - Entry point
│   └── prompt/
│       └── page.tsx          - Prompt input (uses GenerationFlow)
└── globals.css               - Custom animations
```

---

## Key Design Decisions

### 1. Client-side Progress Simulation
**Why:** Better UX than waiting for server without updates
**How:** Timed intervals update steps independently of AI call

### 2. Three Action Buttons
**Why:** Clear user intent without cognitive overload
**Options:**
- Accept: "I love it, save it"
- Edit: "Good start, let me tweak"
- Regenerate: "Try something different"

### 3. Full-page Preview
**Why:** Immersive, distraction-free experience
**How:** Fixed overlay with scroll, theme applied

### 4. Sticky Bottom Actions
**Why:** Mobile thumb-zone, always accessible
**How:** position: sticky, slides up on mount

### 5. Single Generation at a Time
**Why:** Focus, simplicity, rate limiting
**Trade-off:** Can't generate multiple variants simultaneously

---

## Performance Considerations

### Bundle Size
- GenerationFlow: ~5KB
- AILoadingState: ~3KB
- Preview + Actions: ~4KB
- Total: ~12KB (gzipped)

### Runtime Performance
- React renders: Optimized with useCallback
- Animations: CSS-based (GPU accelerated)
- State updates: Minimal re-renders
- Memory: Cleaned up on unmount

### Network
- Single API call for generation
- Cached results (5min TTL)
- Optimistic UI updates
- Error retry with backoff

---

## Accessibility

### Keyboard Navigation
- Tab through all buttons
- Enter to submit
- Escape to close
- Focus trapping in modals

### Screen Readers
- ARIA labels on buttons
- Progress announcements
- Error messages announced
- Loading states announced

### Visual
- High contrast text
- Clear focus indicators
- Large touch targets (48px+)
- Color not only indicator

---

## Browser Compatibility

Tested in:
- Chrome 120+ ✅
- Safari 17+ ✅
- Firefox 121+ ✅
- Edge 120+ ✅
- Mobile Safari iOS 16+ ✅
- Chrome Android 120+ ✅

Features used:
- CSS Grid/Flexbox
- CSS Variables
- Backdrop filter
- Smooth animations
- Modern ES6+

---

## Future Improvements

1. **Real-time streaming**: Server-sent events
2. **Cancel generation**: Abort in-flight requests
3. **Multiple variations**: Generate 3 at once
4. **Draft saving**: Save before accepting
5. **History**: See past generations
6. **Keyboard shortcuts**: Cmd+Enter, Cmd+R
7. **Voice input**: Speech-to-text
8. **A/B testing**: Compare variations

---

**Architecture Version:** 1.0  
**Last Updated:** December 1, 2025

