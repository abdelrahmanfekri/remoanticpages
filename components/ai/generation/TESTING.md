# Phase 3 Testing Plan - AI Generation Flow

## Test Environment

**URL:** http://localhost:3000/create/prompt
**Prerequisites:**
- Dev server running (`npm run dev`)
- User logged in
- OpenAI API key configured

---

## Test Cases

### 1. Basic Flow Test

**Steps:**
1. Navigate to `/create`
2. Click "Start with AI Prompt"
3. Select an occasion (e.g., "Birthday")
4. Enter prompt: "Create a beautiful birthday page for my best friend Sarah who loves photography and nature"
5. Click "Generate with AI"

**Expected:**
- ✅ Loading modal appears immediately
- ✅ Progress steps show in order (Analyze → Theme → Blocks → Content → Finalize)
- ✅ Each step animates through pending → in_progress → completed
- ✅ Progress bar fills incrementally
- ✅ After ~5-6 seconds, preview appears
- ✅ Preview shows generated page with theme applied
- ✅ Action buttons appear at bottom (sticky)

---

### 2. Preview & Actions Test

**Steps:**
1. Complete basic flow above
2. Review the generated preview

**Expected:**
- ✅ All blocks render correctly
- ✅ Theme colors applied (primary, secondary)
- ✅ Content is personalized (mentions "Sarah")
- ✅ Three action buttons visible:
  - "Looks Great!" (gradient rose/pink)
  - "Edit This" (blue)
  - "Try Again" (white/outlined)
- ✅ AI reasoning box shows (if available)
- ✅ Smooth scroll through preview
- ✅ Close button in top-right corner

---

### 3. Accept Page Test

**Steps:**
1. Complete basic flow
2. Click "Looks Great!" button

**Expected:**
- ✅ "Saving your page..." modal appears
- ✅ Redirects to `/dashboard/edit/[pageId]`
- ✅ Page loads in editor with all blocks
- ✅ Theme is applied
- ✅ Can edit blocks immediately

---

### 4. Edit Page Test

**Steps:**
1. Complete basic flow
2. Click "Edit This" button

**Expected:**
- ✅ Same as Accept test above
- ✅ Opens in editor mode
- ✅ All blocks editable

---

### 5. Regenerate Test

**Steps:**
1. Complete basic flow
2. Click "Try Again" button

**Expected:**
- ✅ Preview closes
- ✅ Generation starts again with same prompt
- ✅ New loading modal appears
- ✅ Progress steps animate again
- ✅ New page generated (may be different)
- ✅ New preview appears

---

### 6. Error Handling Test

**Test 6a: Network Error**

**Steps:**
1. Disable network or pause OpenAI API
2. Attempt to generate page

**Expected:**
- ✅ Error modal appears
- ✅ Clear error message shown
- ✅ "Try Again" button available
- ✅ "Cancel" button returns to prompt input

**Test 6b: Rate Limit**

**Steps:**
1. Generate pages until rate limit hit (Free: 1/day)
2. Attempt another generation

**Expected:**
- ✅ Error shows rate limit message
- ✅ Suggests upgrade to premium
- ✅ Can cancel back to input

**Test 6c: Invalid Prompt**

**Steps:**
1. Enter very short prompt (< 20 chars)
2. Click generate

**Expected:**
- ✅ Button disabled or validation message
- ✅ Character counter shows minimum requirement

---

### 7. Mobile Responsiveness Test

**Devices to Test:**
- iPhone 13 Pro (390x844)
- iPhone SE (375x667)
- iPad (768x1024)
- Android (360x800)

**Steps:**
1. Navigate to prompt page on mobile
2. Complete full generation flow

**Expected:**
- ✅ Occasion selector wraps properly
- ✅ Prompt textarea comfortable size
- ✅ Loading modal fills screen
- ✅ Progress steps readable
- ✅ Preview scrolls smoothly
- ✅ Action buttons stack vertically
- ✅ Bottom action bar easy to tap
- ✅ All buttons minimum 48px height

---

### 8. Animation & Performance Test

**Steps:**
1. Complete generation flow
2. Observe animations

**Expected:**
- ✅ Loading modal fades in
- ✅ Progress bar animates smoothly
- ✅ Step transitions are smooth
- ✅ Preview fades in nicely
- ✅ Action buttons have hover effects
- ✅ No jank or stuttering
- ✅ 60fps animations

---

### 9. Occasion Variety Test

Test with different occasions:

**Birthday:**
- Warm, vibrant colors (pinks, purples)
- Personal, celebratory tone

**Anniversary:**
- Romantic colors (roses, purples, golds)
- Intimate, loving tone

**Wedding:**
- Elegant colors (golds, whites)
- Formal, joyful tone

**Valentine's:**
- Red, pink, romantic
- Passionate, sweet tone

**Expected:**
- ✅ Each occasion generates appropriate theme
- ✅ Block selection matches occasion
- ✅ Content tone matches occasion
- ✅ Colors are cohesive and beautiful

---

### 10. Content Quality Test

**Steps:**
1. Generate pages with various prompts
2. Review content quality

**Check for:**
- ✅ Content is personalized (uses names)
- ✅ Avoids generic phrases
- ✅ Appropriate length (not too long/short)
- ✅ Grammatically correct
- ✅ Emotionally authentic
- ✅ Matches user's prompt intent
- ✅ Block types are appropriate
- ✅ Logical flow from start to finish

---

### 11. Edge Cases Test

**Test 11a: Very Long Prompt**

**Steps:**
1. Enter 500+ character prompt
2. Generate

**Expected:**
- ✅ Handles gracefully
- ✅ Generates appropriate page
- ✅ No truncation errors

**Test 11b: Special Characters**

**Steps:**
1. Enter prompt with emojis, quotes, apostrophes
2. Generate

**Expected:**
- ✅ Handles special characters
- ✅ No encoding issues
- ✅ Content renders correctly

**Test 11c: Multiple Rapid Clicks**

**Steps:**
1. Click generate button multiple times rapidly

**Expected:**
- ✅ Only one generation starts
- ✅ Button disables immediately
- ✅ No duplicate requests

---

### 12. Close/Cancel Test

**Steps:**
1. Start generation
2. Try to close browser tab
3. Or click Cancel (if available)

**Expected:**
- ✅ Generation continues in background
- ✅ Or cancels gracefully
- ✅ No orphaned requests

---

### 13. Browser Back Button Test

**Steps:**
1. Complete generation to preview
2. Click browser back button

**Expected:**
- ✅ Returns to prompt input
- ✅ Prompt text preserved
- ✅ Occasion preserved
- ✅ Can regenerate

---

### 14. Different User Tiers Test

**Free Tier:**
- ✅ Generates with free blocks only
- ✅ Basic model (gpt-4o-mini)
- ✅ Rate limited to 1/day

**Premium Tier:**
- ✅ Can use premium blocks
- ✅ Better model
- ✅ 10 generations/day

**Pro Tier:**
- ✅ Unlimited generations
- ✅ Best model (gpt-4o)
- ✅ Advanced features

---

## Performance Benchmarks

Target metrics:

- ✅ Initial load < 2s
- ✅ Generation time < 10s
- ✅ Preview render < 1s
- ✅ Smooth 60fps animations
- ✅ No memory leaks
- ✅ Mobile bundle < 200KB

---

## Accessibility Test

**Keyboard Navigation:**
- ✅ Tab through all interactive elements
- ✅ Enter to submit
- ✅ Escape to close modal
- ✅ Focus indicators visible

**Screen Reader:**
- ✅ Progress steps announced
- ✅ Button labels clear
- ✅ Loading states announced
- ✅ Error messages announced

**Color Contrast:**
- ✅ WCAG AA compliant
- ✅ Text readable on all backgrounds

---

## Browser Compatibility

Test in:
- ✅ Chrome (latest)
- ✅ Safari (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

---

## Known Limitations

1. Progress updates are simulated (not real-time from server)
2. Cannot cancel mid-generation
3. No save draft functionality yet
4. Single generation at a time

---

## Success Criteria

Phase 3 is successful if:

- ✅ All 14 test cases pass
- ✅ No critical bugs
- ✅ Mobile experience smooth
- ✅ Performance targets met
- ✅ Accessibility requirements met
- ✅ Beautiful, polished UX
- ✅ Users can successfully generate and accept pages

---

## Manual Testing Checklist

Before marking Phase 3 complete:

- [ ] Test basic flow end-to-end
- [ ] Test all three action buttons
- [ ] Test error handling
- [ ] Test on real mobile device
- [ ] Test different occasions
- [ ] Review content quality
- [ ] Test edge cases
- [ ] Verify accessibility
- [ ] Check browser compatibility
- [ ] Performance profiling
- [ ] Code review
- [ ] Linter checks pass
- [ ] No console errors
- [ ] README updated

---

**Testing Date:** _____________

**Tester:** _____________

**Results:** _____________

**Issues Found:** _____________

**Status:** [ ] Passed [ ] Failed [ ] Needs Fixes

