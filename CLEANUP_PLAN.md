# 🧹 Complete Cleanup Plan

## Overview
This document provides a comprehensive, step-by-step cleanup plan to remove all old template-based code and prepare the codebase for production.

---

## ⚠️ Prerequisites

**Before starting cleanup:**
1. ✅ Backup your current codebase (git commit)
2. ✅ Test the new block-based system thoroughly
3. ✅ Verify all features work correctly
4. ✅ Confirm database migration is successful
5. ✅ Have a rollback plan ready

```bash
# Create a backup branch
git checkout -b pre-cleanup-backup
git push origin pre-cleanup-backup

# Create cleanup branch
git checkout main
git checkout -b cleanup-old-template-system
```

---

## 📋 Cleanup Phases

### **Phase 1: Remove Old Template Schema** (5 min)

#### Files to Delete:
```bash
# Delete old template schema file
rm lib/template-schemas.ts
```

**Verification:**
```bash
# Search for any imports of this file
grep -r "from '@/lib/template-schemas'" . --exclude-dir=node_modules
grep -r "from '../lib/template-schemas'" . --exclude-dir=node_modules

# Should return 0 results
```

**Fix Remaining Imports:**
If any files still import from `template-schemas`, update them to use `lib/blocks` instead.

---

### **Phase 2: Remove Old Template Components** (10 min)

#### Files to Delete:
```bash
# Delete entire template-components folder
rm -rf components/template-components/
```

This removes:
- `components/template-components/DynamicTemplateRenderer.tsx`
- `components/template-components/HeroSection.tsx`
- `components/template-components/IntroSection.tsx`
- `components/template-components/MediaGallery.tsx`
- `components/template-components/MemoriesSection.tsx`
- `components/template-components/TimelineSection.tsx`
- `components/template-components/QuoteSection.tsx`
- `components/template-components/VideoSection.tsx`
- `components/template-components/CountdownSection.tsx`
- `components/template-components/TwoColumnSection.tsx`
- `components/template-components/TestimonialsSection.tsx`
- `components/template-components/MapLocationSection.tsx`
- `components/template-components/FinalMessageSection.tsx`
- `components/template-components/MusicPlayer.tsx`
- `components/template-components/index.ts`

**Verification:**
```bash
# Search for any imports from template-components
grep -r "from '@/components/template-components'" . --exclude-dir=node_modules
grep -r "from '../components/template-components'" . --exclude-dir=node_modules
grep -r "from './template-components'" . --exclude-dir=node_modules

# Should return 0 results
```

---

### **Phase 3: Remove Old Editor Store** (5 min)

#### Files to Delete:
```bash
# Delete old editor store
rm lib/stores/editor-store.ts
```

**Verification:**
```bash
# Search for imports of old store
grep -r "from '@/lib/stores/editor-store'" . --exclude-dir=node_modules
grep -r "useEditorStore" . --exclude-dir=node_modules | grep -v "block-editor-store"

# Should return 0 results (except from block-editor-store)
```

**Fix Remaining Imports:**
Replace any remaining `useEditorStore` with `useBlockEditorStore` from `block-editor-store.ts`

---

### **Phase 4: Remove Old Editor Components** (10 min)

#### Files to Delete:
```bash
# Delete old visual template editor
rm components/VisualTemplateEditor.tsx

# Delete old editor components (if they exist and aren't used)
rm components/AnimationEditor.tsx 2>/dev/null || true
rm components/editor/ComponentPreview.tsx 2>/dev/null || true
rm components/editor/EditableText.tsx 2>/dev/null || true
rm components/editor/InlineComponentEditor.tsx 2>/dev/null || true
rm components/editor/QuickSetupScreen.tsx 2>/dev/null || true
```

**Verification:**
```bash
# Check for imports
grep -r "VisualTemplateEditor" . --exclude-dir=node_modules
grep -r "AnimationEditor" . --exclude-dir=node_modules
grep -r "ComponentPreview" . --exclude-dir=node_modules
grep -r "EditableText" . --exclude-dir=node_modules
grep -r "InlineComponentEditor" . --exclude-dir=node_modules
grep -r "QuickSetupScreen" . --exclude-dir=node_modules

# Should return 0 results
```

---

### **Phase 5: Remove Old Create/Edit Pages** (10 min)

#### Files to Delete:
```bash
# Delete old create flow with template ID
rm -rf app/create/\[templateId\]/

# Delete old choose template page
rm -rf app/create/choose-template/

# Delete old custom folder (if exists)
rm -rf app/create/custom/
```

**Keep These (Already Updated):**
- ✅ `app/dashboard/create/page.tsx` - Rewritten with new system
- ✅ `app/dashboard/edit/[id]/page.tsx` - Rewritten with new system
- ✅ `app/p/[slug]/page.tsx` - Updated to use BlockRenderer

**Verification:**
```bash
# Check remaining create pages
ls -la app/create/

# Should only show:
# - page.tsx (if you create unified entry point)
# - prompt/ (if you create AI prompt flow)

# Check for old routing references
grep -r "create/\[templateId\]" . --exclude-dir=node_modules
grep -r "choose-template" . --exclude-dir=node_modules

# Should return 0 results
```

---

### **Phase 6: Clean Up Migration Files** (5 min)

#### Files in `supabase/migrations/`:

**Keep:**
- ✅ `001_block_based_schema.sql` - New schema

**Delete Old Migrations:**
```bash
# These are replaced by the new schema
# Only delete if you've already applied the new migration
# and are starting fresh

# If using version control and starting fresh:
rm supabase/migrations/001_initial_schema.sql
rm supabase/migrations/002_add_config_to_pages.sql
rm supabase/migrations/003_add_subscription_policies.sql
```

**⚠️ Important:**
- If you have a production database with the old schema, **DO NOT** delete these yet
- Instead, create a migration script to transform old data to new format
- Only delete after successful migration

**Verification:**
```bash
ls -la supabase/migrations/

# Should show only:
# - 001_block_based_schema.sql (or whatever you named the new one)
```

---

### **Phase 7: Remove Unused Type Definitions** (5 min)

#### Check for Old Types:

**Search for unused types:**
```bash
# Search for old template-related types
grep -r "TemplateName" . --exclude-dir=node_modules | grep -v "lib/blocks"
grep -r "ComponentType" . --exclude-dir=node_modules | grep -v "lib/blocks"
grep -r "TemplateConfig" . --exclude-dir=node_modules | grep -v "lib/blocks"
```

**Update or Remove:**
- If types are used in `lib/blocks`, keep them
- If types are unused, remove from type files

---

### **Phase 8: Clean Up Unused Imports** (10 min)

#### Run Linter:
```bash
# Check for unused imports (if using ESLint)
npm run lint

# Or run TypeScript check
npx tsc --noEmit
```

#### Common Unused Imports to Remove:
```typescript
// Old template imports
import { getTemplateSchema } from '@/lib/template-schemas' // ❌
import { DynamicTemplateRenderer } from '@/components/template-components' // ❌
import { VisualTemplateEditor } from '@/components/VisualTemplateEditor' // ❌

// Replace with new imports
import { getBlockDefinition } from '@/lib/blocks' // ✅
import { BlockRenderer } from '@/components/blocks' // ✅
import { BlockEditor } from '@/components/editor/BlockEditor' // ✅
```

#### Auto-fix (if using ESLint):
```bash
npm run lint -- --fix
```

---

### **Phase 9: Remove Unused Dependencies** (5 min)

#### Check package.json:

Review and remove any template-specific dependencies that are no longer used.

```bash
# Check for unused dependencies
npx depcheck
```

#### Common Dependencies to Review:
- Check if any packages were used only for old template system
- Most likely all dependencies are still needed

---

### **Phase 10: Clean Up Assets** (5 min)

#### Review Public Assets:

```bash
# Check for old template-specific assets
ls -la public/templates/ 2>/dev/null || echo "No templates folder"
ls -la public/images/templates/ 2>/dev/null || echo "No template images"
```

**Delete if exists:**
```bash
rm -rf public/templates/
rm -rf public/images/templates/
```

**Keep:**
- ✅ `public/images/` - General images
- ✅ `public/music/` - Music files

---

### **Phase 11: Update Documentation** (10 min)

#### Files to Update:

**1. Update package.json (if needed):**
```json
{
  "name": "romanticstory",
  "version": "2.0.0",
  "description": "AI-powered block-based page builder"
}
```

**2. Update any inline documentation:**
```bash
# Search for references to "template system"
grep -r "template system" . --exclude-dir=node_modules --exclude=README.md

# Update any found references to "block system"
```

**3. Update JSDoc comments:**
```typescript
// Old ❌
/** Creates a page from template */

// New ✅
/** Creates a page with blocks */
```

---

### **Phase 12: Database Cleanup** (15 min)

#### If Starting Fresh:

**Option A: Drop & Recreate (Development Only)**
```sql
-- ⚠️ DANGER: This deletes all data!
-- Only for development/testing

-- Drop all tables
DROP TABLE IF EXISTS page_analytics CASCADE;
DROP TABLE IF EXISTS ai_suggestions CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS memories CASCADE;
DROP TABLE IF EXISTS page_blocks CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;

-- Run new migration
-- Then upload: 001_block_based_schema.sql
```

**Option B: Data Migration (Production)**

If you have existing pages in production:

```sql
-- Create migration script: 004_migrate_to_blocks.sql

-- 1. Create temporary backup
CREATE TABLE pages_backup AS SELECT * FROM pages;

-- 2. For each existing page, create blocks from config
-- This is complex and depends on your old structure
-- Example:

INSERT INTO page_blocks (page_id, type, display_order, content, settings)
SELECT 
  p.id as page_id,
  'hero' as type,
  0 as display_order,
  jsonb_build_object(
    'title', p.title,
    'subtitle', p.recipient_name
  ) as content,
  '{}'::jsonb as settings
FROM pages p;

-- 3. Add intro blocks from intro_text
INSERT INTO page_blocks (page_id, type, display_order, content, settings)
SELECT 
  p.id as page_id,
  'intro' as type,
  1 as display_order,
  jsonb_build_object('text', p.intro_text) as content,
  '{}'::jsonb as settings
FROM pages p
WHERE p.intro_text IS NOT NULL;

-- 4. Add final message blocks
INSERT INTO page_blocks (page_id, type, display_order, content, settings)
SELECT 
  p.id as page_id,
  'final-message' as type,
  2 as display_order,
  jsonb_build_object('message', p.final_message) as content,
  '{}'::jsonb as settings
FROM pages p
WHERE p.final_message IS NOT NULL;

-- 5. Update pages table structure
-- Move old fields to new structure
UPDATE pages SET
  theme = jsonb_build_object(
    'primaryColor', '#f43f5e',
    'secondaryColor', '#ec4899',
    'fontFamily', 'serif'
  ),
  settings = jsonb_build_object(
    'musicUrl', background_music_url,
    'isPublic', is_public,
    'passwordHash', password_hash
  );

-- 6. Drop old columns
ALTER TABLE pages 
  DROP COLUMN IF EXISTS hero_text,
  DROP COLUMN IF EXISTS intro_text,
  DROP COLUMN IF EXISTS final_message,
  DROP COLUMN IF EXISTS background_music_url,
  DROP COLUMN IF EXISTS is_public,
  DROP COLUMN IF EXISTS password_hash,
  DROP COLUMN IF EXISTS language,
  DROP COLUMN IF EXISTS media_count,
  DROP COLUMN IF EXISTS has_music,
  DROP COLUMN IF EXISTS has_custom_animations,
  DROP COLUMN IF EXISTS config,
  DROP COLUMN IF EXISTS template_name;

-- 7. Verify migration
SELECT 
  p.id,
  p.title,
  COUNT(pb.id) as block_count
FROM pages p
LEFT JOIN page_blocks pb ON pb.page_id = p.id
GROUP BY p.id, p.title;
```

---

### **Phase 13: Test Everything** (30 min)

#### Testing Checklist:

**1. Database Tests:**
- [ ] Can create new pages
- [ ] Can load existing pages
- [ ] Can update pages
- [ ] Can delete pages
- [ ] Blocks are saved correctly
- [ ] Blocks are loaded in correct order
- [ ] Memories are associated correctly
- [ ] Media is associated correctly

**2. UI Tests:**
- [ ] Dashboard loads
- [ ] Create page flow works
- [ ] Template selection works
- [ ] Block editor opens
- [ ] Can add blocks
- [ ] Can edit blocks
- [ ] Can delete blocks
- [ ] Can reorder blocks
- [ ] Can save page
- [ ] Public page displays correctly

**3. Mobile Tests:**
- [ ] Responsive on mobile (320px+)
- [ ] Touch targets work (44px+)
- [ ] Scrolling is smooth
- [ ] Modals work on mobile
- [ ] Bottom sheets work

**4. Browser Tests:**
- [ ] Chrome (Desktop & Mobile)
- [ ] Safari (Desktop & iOS)
- [ ] Firefox
- [ ] Edge

**5. Feature Tests:**
- [ ] Theme changes work
- [ ] Media upload works
- [ ] Music upload works
- [ ] Password protection works
- [ ] Public/private toggle works
- [ ] Analytics tracking works

**6. Error Tests:**
- [ ] Network errors handled gracefully
- [ ] Invalid data rejected
- [ ] Rate limiting works
- [ ] 404 pages work
- [ ] Error boundaries catch errors

---

### **Phase 14: Performance Optimization** (20 min)

#### Run Performance Checks:

```bash
# Build for production
npm run build

# Check bundle size
npm run build -- --analyze

# Run Lighthouse
# Open Chrome DevTools > Lighthouse > Run audit
```

#### Optimization Tasks:
- [ ] Enable code splitting
- [ ] Lazy load heavy components
- [ ] Optimize images
- [ ] Enable caching
- [ ] Minimize bundle size
- [ ] Remove console.logs

**Target Metrics:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

---

### **Phase 15: Security Audit** (15 min)

#### Security Checklist:

**1. RLS Policies:**
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- All tables should have rowsecurity = true
```

**2. API Keys:**
```bash
# Ensure no API keys in code
grep -r "sk-" . --exclude-dir=node_modules
grep -r "pk_" . --exclude-dir=node_modules

# Should return 0 results
```

**3. Environment Variables:**
```bash
# Check .env files are gitignored
cat .gitignore | grep ".env"

# Verify .env.local is not committed
git ls-files | grep ".env.local"
# Should return 0 results
```

**4. Dependencies:**
```bash
# Check for vulnerabilities
npm audit

# Fix if needed
npm audit fix
```

**5. Input Validation:**
- [ ] All user inputs are validated
- [ ] Server actions use Zod schemas
- [ ] SQL injection protected (using Supabase)
- [ ] XSS protected (React escapes by default)

---

### **Phase 16: Git Cleanup** (10 min)

#### Clean Up Git History:

```bash
# Stage all deletions and changes
git add -A

# Commit cleanup
git commit -m "feat: remove old template system, migrate to block-based architecture

- Removed lib/template-schemas.ts
- Removed components/template-components/
- Removed lib/stores/editor-store.ts
- Removed old editor components
- Removed old create/edit pages
- Cleaned up unused imports
- Updated documentation
- All tests passing

BREAKING CHANGE: Template-based system removed, migrated to flexible block system"

# Push to remote
git push origin cleanup-old-template-system
```

#### Create Pull Request:
```markdown
# PR Title: 
Migrate to Block-Based Architecture

## Description
Complete migration from rigid template system to flexible block-based architecture.

## Changes
- ✅ New block system with 17 block types
- ✅ Flexible page builder
- ✅ Updated database schema
- ✅ New editor components
- ✅ Mobile-first responsive design
- ❌ Removed old template system

## Testing
- [x] All unit tests pass
- [x] Integration tests pass
- [x] Manual testing complete
- [x] Mobile testing complete
- [x] Browser compatibility verified

## Breaking Changes
- Old template-based pages need migration
- API changes (if applicable)

## Migration Guide
See README.md for database migration steps.
```

---

### **Phase 17: Final Verification** (15 min)

#### Final Checklist:

**Code Quality:**
- [ ] No console.logs in production code
- [ ] No commented-out code
- [ ] No TODO comments (or tracked in issues)
- [ ] No unused files
- [ ] No unused imports
- [ ] TypeScript strict mode passes
- [ ] ESLint passes with no warnings

**Documentation:**
- [ ] README.md updated
- [ ] API documentation updated (if applicable)
- [ ] Comments are clear and helpful
- [ ] Complex logic is documented

**Testing:**
- [ ] All tests pass
- [ ] Test coverage adequate
- [ ] Manual testing complete
- [ ] Staging deployment tested

**Performance:**
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Lighthouse scores meet targets

**Security:**
- [ ] No secrets in code
- [ ] RLS policies verified
- [ ] Input validation complete
- [ ] Dependencies audited

---

## 📊 Cleanup Summary

### Files Deleted:
```
lib/
  ❌ template-schemas.ts

components/
  ❌ VisualTemplateEditor.tsx
  ❌ AnimationEditor.tsx (if exists)
  ❌ template-components/ (entire folder)
  editor/
    ❌ ComponentPreview.tsx (if old)
    ❌ EditableText.tsx (if unused)
    ❌ InlineComponentEditor.tsx (if old)
    ❌ QuickSetupScreen.tsx (if old)

lib/stores/
  ❌ editor-store.ts

app/
  create/
    ❌ [templateId]/ (entire folder)
    ❌ choose-template/ (entire folder)
    ❌ custom/ (if exists)

supabase/migrations/
  ❌ 001_initial_schema.sql (after migration)
  ❌ 002_add_config_to_pages.sql (after migration)
  ❌ 003_add_subscription_policies.sql (merged)

public/
  ❌ templates/ (if exists)
  ❌ images/templates/ (if exists)
```

### Estimated Time:
- **Automated cleanup:** ~30 minutes
- **Manual verification:** ~1 hour
- **Testing:** ~1-2 hours
- **Total:** ~2-3 hours

---

## 🚨 Rollback Plan

If something goes wrong:

```bash
# 1. Switch to backup branch
git checkout pre-cleanup-backup

# 2. Verify everything works
npm run dev

# 3. If database was changed, restore from backup
# (Supabase has automatic backups)

# 4. Investigate what went wrong
git diff pre-cleanup-backup cleanup-old-template-system

# 5. Fix issues and try again
```

---

## ✅ Post-Cleanup Actions

After successful cleanup:

1. **Merge to main:**
```bash
git checkout main
git merge cleanup-old-template-system
git push origin main
```

2. **Deploy to staging:**
```bash
# Deploy to staging environment
# Test thoroughly
```

3. **Monitor for issues:**
- Check error logs
- Monitor user reports
- Watch analytics

4. **Deploy to production:**
```bash
# When confident, deploy to production
```

5. **Archive old branch:**
```bash
# Keep backup for 30 days, then delete
git branch -d pre-cleanup-backup
```

---

## 📝 Notes

- **Backup everything** before starting
- **Test each phase** before moving to next
- **Keep backup branch** for at least 30 days
- **Monitor production** closely after deployment
- **Document any issues** encountered

---

**Last Updated:** December 2024

