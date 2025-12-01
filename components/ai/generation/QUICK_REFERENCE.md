# Quick Reference - Phase 3 Components

## Component Usage

### GenerationFlow
Main orchestrator component.

```tsx
import { GenerationFlow } from '@/components/ai/generation'

<GenerationFlow
  prompt="Your prompt here"
  occasion="birthday" // optional
  recipientName="Sarah" // optional
  onComplete={(pageId, slug) => {
    // Called after successful save
    console.log('Page created:', pageId)
  }}
  onCancel={() => {
    // Called when user cancels
    console.log('Generation cancelled')
  }}
/>
```

### AILoadingState
Reusable loading component.

```tsx
import { AILoadingState } from '@/components/ai/core'
import { GenerationStep } from '@/lib/ai/core/agent-generator'

const steps: GenerationStep[] = [
  { step: 'analyze', status: 'completed', message: 'Analyzed', progress: 100 },
  { step: 'theme', status: 'in_progress', message: 'Creating theme...', progress: 50 },
  { step: 'blocks', status: 'pending', message: 'Waiting', progress: 0 },
]

<AILoadingState 
  steps={steps}
  currentMessage="Generating your page..."
/>
```

### GenerationPreview
Full-page preview.

```tsx
import { GenerationPreview } from '@/components/ai/generation'

<GenerationPreview
  page={generatedPage}
  onClose={() => setShowPreview(false)}
/>
```

### GenerationActions
Action buttons.

```tsx
import { GenerationActions } from '@/components/ai/generation'

<GenerationActions
  onAccept={handleAccept}
  onRegenerate={handleRegenerate}
  onEdit={handleEdit}
  isLoading={false}
/>
```

---

## Server Actions

### generatePageWithAI
Generate page from prompt.

```tsx
import { generatePageWithAI } from '@/lib/actions/ai/generate-page'

const result = await generatePageWithAI({
  prompt: "Create a birthday page",
  occasion: "birthday",
  recipientName: "Sarah"
})

if (result.error) {
  console.error(result.error)
} else {
  console.log(result.page)
}
```

### acceptGeneratedPage
Save generated page.

```tsx
import { acceptGeneratedPage } from '@/lib/actions/ai/generate-page'

const result = await acceptGeneratedPage(generatedPage)

if (result.error) {
  console.error(result.error)
} else {
  console.log('Saved:', result.pageId, result.slug)
}
```

---

## Types

### GeneratedPage
```typescript
interface GeneratedPage {
  title: string
  recipientName: string
  theme: PageTheme
  blocks: BlockData[]
  reasoning?: string
}
```

### PageTheme
```typescript
interface PageTheme {
  primaryColor: string     // "#f43f5e"
  secondaryColor: string   // "#ec4899"
  fontFamily: string       // "sans-serif" | "serif"
  backgroundColor?: string // "#ffffff"
}
```

### GenerationStep
```typescript
interface GenerationStep {
  step: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  message: string
  progress: number // 0-100
}
```

---

## Animations

Custom CSS classes added to `globals.css`:

```css
.animate-pulse-once     /* Single pulse animation */
.animate-fade-in        /* Fade in with slide up */
```

Usage:
```tsx
<button className="animate-pulse-once">
  Click me!
</button>
```

---

## State Flow

```typescript
type FlowState = 'idle' | 'generating' | 'preview' | 'accepting' | 'error'

// State transitions:
idle → generating → preview → accepting → [navigate away]
                      ↓
                    error → [retry]
```

---

## File Locations

```
components/
  ai/
    core/
      AILoadingState.tsx
      index.ts
    generation/
      GenerationFlow.tsx       ← Main component
      GenerationProgress.tsx
      GenerationPreview.tsx
      GenerationActions.tsx
      index.ts
      README.md
      TESTING.md
      COMPLETION.md
      ARCHITECTURE.md

lib/
  actions/
    ai/
      generate-page.ts         ← Server actions
  ai/
    core/
      agent-generator.ts       ← AI agent

app/
  create/
    prompt/
      page.tsx                 ← Uses GenerationFlow
  globals.css                  ← Custom animations
```

---

## Props Reference

### GenerationFlow Props
```typescript
interface GenerationFlowProps {
  prompt: string              // Required: User's prompt
  occasion?: string           // Optional: birthday, anniversary, etc.
  recipientName?: string      // Optional: Name of recipient
  onComplete?: (pageId: string, slug: string) => void
  onCancel?: () => void
}
```

### AILoadingState Props
```typescript
interface AILoadingStateProps {
  steps: GenerationStep[]     // Required: Array of steps
  currentMessage?: string     // Optional: Override message
}
```

### GenerationPreview Props
```typescript
interface GenerationPreviewProps {
  page: GeneratedPage         // Required: Generated page data
  onClose: () => void         // Required: Close handler
}
```

### GenerationActions Props
```typescript
interface GenerationActionsProps {
  onAccept: () => void        // Required: Accept handler
  onRegenerate: () => void    // Required: Regenerate handler
  onEdit: () => void          // Required: Edit handler
  isLoading?: boolean         // Optional: Disable buttons
}
```

---

## Example: Complete Flow

```tsx
'use client'

import { useState } from 'react'
import { GenerationFlow } from '@/components/ai/generation'

export default function MyPage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    if (prompt.length < 20) {
      alert('Prompt too short')
      return
    }
    setIsGenerating(true)
  }

  const handleComplete = (pageId: string, slug: string) => {
    console.log('Page created:', pageId, slug)
    // Navigate or show success
  }

  const handleCancel = () => {
    setIsGenerating(false)
  }

  return (
    <div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your page..."
      />
      
      <button onClick={handleGenerate}>
        Generate
      </button>

      {isGenerating && (
        <GenerationFlow
          prompt={prompt}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}
```

---

## Styling

Components use Tailwind CSS with custom classes:

```tsx
// Gradient button
className="bg-gradient-to-r from-rose-500 to-pink-500"

// Glass effect
className="bg-white/95 backdrop-blur-sm"

// Responsive spacing
className="p-4 md:p-6 lg:p-8"

// Hover effects
className="hover:scale-110 transition-transform"
```

---

## Testing Utilities

```typescript
// Mock steps for testing
const mockSteps: GenerationStep[] = [
  { step: 'analyze', status: 'pending', message: 'Analyzing', progress: 0 },
  { step: 'theme', status: 'pending', message: 'Theme', progress: 0 },
  { step: 'blocks', status: 'pending', message: 'Blocks', progress: 0 },
  { step: 'content', status: 'pending', message: 'Content', progress: 0 },
  { step: 'finalize', status: 'pending', message: 'Finalize', progress: 0 },
]

// Mock page for testing
const mockPage: GeneratedPage = {
  title: "Happy Birthday!",
  recipientName: "Sarah",
  theme: {
    primaryColor: "#f43f5e",
    secondaryColor: "#ec4899",
    fontFamily: "sans-serif"
  },
  blocks: [
    {
      id: "hero-1",
      type: "hero",
      content: { title: "Happy Birthday!", subtitle: "Sarah" },
      settings: {},
      order: 0
    }
  ],
  reasoning: "Created a warm birthday theme..."
}
```

---

## Troubleshooting

### Progress not updating
- Check if `simulateProgress()` is running
- Verify state updates in React DevTools
- Check for errors in console

### Preview not showing
- Verify `generatedPage` has data
- Check if state is `preview`
- Inspect BlockRenderer errors

### Actions not working
- Check if buttons are disabled (`isLoading`)
- Verify onClick handlers are bound
- Check server action responses

### Animations not smooth
- Verify CSS classes exist in `globals.css`
- Check if GPU acceleration is working
- Test on different browsers

---

## Performance Tips

1. **Memoize callbacks**: Use `useCallback` for handlers
2. **Lazy load**: Split code where possible
3. **Optimize images**: Use Next.js Image component
4. **Cache results**: AI responses cached for 5 minutes
5. **Debounce inputs**: Prevent excessive re-renders

---

## Accessibility

### Keyboard Support
- `Tab`: Navigate buttons
- `Enter`: Submit/Accept
- `Escape`: Close modal
- `Space`: Click buttons

### Screen Reader
- Progress steps announced
- Buttons have labels
- Loading states announced
- Errors announced

### Visual
- High contrast text
- Focus indicators
- Large touch targets
- Color + text indicators

---

## Browser Support

✅ Chrome 120+
✅ Safari 17+
✅ Firefox 121+
✅ Edge 120+
✅ Mobile Safari iOS 16+
✅ Chrome Android 120+

---

## Common Patterns

### Conditional Rendering
```tsx
{isGenerating && <GenerationFlow {...props} />}
{showPreview && <GenerationPreview {...props} />}
```

### Error Handling
```tsx
try {
  const result = await generatePageWithAI(input)
  if (result.error) {
    setError(result.error)
  }
} catch (err) {
  setError('Something went wrong')
}
```

### State Management
```tsx
const [state, setState] = useState<FlowState>('idle')
const [steps, setSteps] = useState<GenerationStep[]>([])
const [page, setPage] = useState<GeneratedPage | null>(null)
```

---

**Quick Reference Version:** 1.0  
**Last Updated:** December 1, 2025

