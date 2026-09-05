## Pull Request Summary

**Title format:** `[MODULE] Short description of change`

---

## What changed?

> Describe what this PR does in plain language. What problem does it solve?

---

## Which module?

- [ ] auth
- [ ] admin
- [ ] quotations
- [ ] approvals
- [ ] dealTwin
- [ ] fulfillment
- [ ] billing
- [ ] portal
- [ ] analytics
- [ ] shared / foundation
- [ ] documentation

---

## Tests performed

> Describe what you manually tested. How did you verify the change works?

---

## Screenshots (UI changes)

> Attach before/after screenshots if any UI was changed. Delete this section if no UI changed.

---

## API changes

- [ ] No API changes
- [ ] New endpoint added: `METHOD /api/...`
- [ ] Existing endpoint modified: `METHOD /api/...`
- [ ] Endpoint removed: `METHOD /api/...`

> Document the change:

---

## Database changes

- [ ] No database changes
- [ ] New model added: `ModelName`
- [ ] Existing model modified: `ModelName`
- [ ] Migration required: Yes / No

> Document the change:

---

## Shared file changes

> List any changes to protected/shared files (see CONTRIBUTING.md):

- [ ] No shared file changes
- [ ] `client/src/app/router.tsx`
- [ ] `client/src/app/App.tsx`
- [ ] `client/src/app/providers.tsx`
- [ ] `server/src/app.ts`
- [ ] `server/src/server.ts`
- [ ] `package.json` / `client/package.json` / `server/package.json`
- [ ] Other: ___

---

## Potential merge conflicts

> Are there any files in this PR that other members may be currently editing?

- [ ] No conflicts expected
- [ ] Possible conflict with: ___

---

## Integration notes

> Does this change require another member to update their module or run a migration?

---

## Checklist

- [ ] I have read `CONTRIBUTING.md`
- [ ] I have tested this locally
- [ ] I have not committed `.env` or `node_modules`
- [ ] I have not modified another member's module
- [ ] Secrets are NOT hardcoded
- [ ] Business logic is in the service layer
- [ ] TypeScript has no new `any` types without justification
- [ ] ESLint passes with no new errors
