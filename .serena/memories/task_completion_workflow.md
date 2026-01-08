# Task Completion Workflow - The Trump Files

## Critical Requirement: Update PROJECT_JOURNAL.md

**After EVERY change, task, or feature completion**, you MUST update `PROJECT_JOURNAL.md` with detailed documentation.

## Documentation Format

Follow the established pattern from previous sessions:

### Session Header
```markdown
## [Session Number]: [Brief Description] (YYYY-MM-DD)

### [Session Number].[Subsection]: [Title]
**AI Model:** Claude Sonnet 4.5 (Thinking)  
**Starting Token Budget:** 200k  
**MCP Servers Active:** Serena, MagicUI, Neon, Playwright
```

### Task Documentation
```markdown
**[YYYY-MM-DD HH:MM] TASK #X COMPLETE: [Task Name]**
- ✅ What was done (bullet points)
- ✅ Files modified/created
- ✅ Technical details
- ✅ Result/status
```

### Files Modified Section
```markdown
**Files Modified:**
- `/path/to/file.tsx` - Description of change
- `/path/to/file2.ts` - Description of change
```

### Session Summary
```markdown
### [Session Number].X Final Status
**Token Usage:** ~XXk/200k (~XXk remaining)
**Tasks Completed:** X/Y
**Status:** COMPLETE / IN PROGRESS
```

## Update Frequency

- **After each task** - Immediate update
- **After each file change** - Log in current session section
- **End of session** - Comprehensive summary
- **Critical fixes** - Document immediately

## What to Document

1. **Changes Made**
   - Exact modifications
   - New features added
   - Bugs fixed
   
2. **Files Affected**
   - Full paths
   - Brief description per file
   
3. **Rationale**
   - Why change was made
   - User requirements met
   
4. **Status Updates**
   - Task completion checkboxes
   - Remaining work items
   
5. **Technical Details**
   - Database queries used
   - Component patterns
   - Performance optimizations

## Example Entry

```markdown
**[2025-10-27 19:15] ✅ TASK #7 COMPLETE: Red → Orange Gradient Replacement**
- ✅ Searched codebase for all red color classes
- ✅ Replaced `bg-red-500` → `bg-orange-500`
- ✅ Updated `border-red-500` → `border-orange-500`
- ✅ Applied to admin page and footer component

**Files Modified:**
- `/app/admin/page.tsx` - Color replacement
- `/components/ui/flickering-footer.tsx` - Color replacement

**Result:** All red colors replaced with orange branding throughout site
```

## Current Task List Reference

See `PROJECT_JOURNAL.md` Section 10-14 for remaining tasks:
- 12 minor polish items remaining
- Most are cosmetic or require backend work
- All critical features complete

## Never Skip Documentation

Even for small fixes:
- Update the journal
- Log the change
- Note file paths
- Update task status

**PROJECT_JOURNAL.md is the single source of truth for project history.**
