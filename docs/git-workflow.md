# DealFlow360 — Git Workflow

---

## Branch Strategy

We use a simplified **GitFlow** strategy adapted for a hackathon team.

```
main            ← Production-ready code only
  └── develop   ← Integration branch (always deployable)
        └── feat/<module>/<feature>   ← Feature branches
        └── fix/<module>/<bug>        ← Bug fix branches
        └── chore/<task>              ← Tooling, docs, config
```

---

## Branch Rules

| Branch | Direct Push | Who can merge |
|--------|-------------|---------------|
| `main` | ❌ Never | Member 1 only (via PR from `develop`) |
| `develop` | ❌ Never | Any member (via approved PR) |
| Feature branches | ✅ Your own branch | Self-merge after review |

---

## Daily Workflow

### Starting a new feature

```bash
# 1. Always start from latest develop
git checkout develop
git pull origin develop

# 2. Create your feature branch
git checkout -b feat/quotations/quotation-builder-ui

# 3. Do your work
# ... code, code, code ...

# 4. Stage and commit frequently
git add .
git commit -m "feat(quotations): add quotation line item component"

# 5. Push your branch
git push origin feat/quotations/quotation-builder-ui

# 6. Open a Pull Request on GitHub → target: develop
```

### Keeping your branch up to date

```bash
# Regularly sync with develop to avoid big merge conflicts
git checkout develop
git pull origin develop
git checkout feat/quotations/quotation-builder-ui
git rebase develop
# OR: git merge develop (if rebase is not comfortable)
```

---

## Commit Message Convention

Use the Conventional Commits standard:

```
<type>(<module>): <short description>

[optional body]
[optional footer]
```

### Types
| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructure (no behavior change) |
| `docs` | Documentation only |
| `chore` | Build process, tooling, config |
| `style` | Formatting, no logic change |
| `test` | Adding or fixing tests |

### Examples
```
feat(auth): add JWT refresh token endpoint
fix(quotations): correct line total calculation
docs(api-contracts): update approval endpoints
chore(deps): add zod to server dependencies
refactor(billing): extract invoice calculation to service
```

---

## Pull Request Rules

1. **Source branch**: Your feature branch
2. **Target branch**: `develop` (never `main`)
3. **Fill the PR template completely** — incomplete PRs are rejected
4. **Minimum 1 reviewer** for feature PRs
5. **All team members** for shared/protected file changes
6. **Squash and merge** strategy (keeps `develop` history clean)

### PR Checklist (auto-checks via template)
- [ ] Code works locally
- [ ] No `.env` committed
- [ ] No `node_modules` committed
- [ ] ESLint passes
- [ ] No hardcoded secrets
- [ ] No cross-module violations

---

## Release to Main

Only Member 1 coordinates `develop → main` merges.

```bash
# When team agrees on a release
git checkout main
git pull origin main
git merge --no-ff develop
git tag v0.1.0
git push origin main --tags
```

---

## Conflict Prevention Strategy

| Potential Conflict | Prevention |
|---|---|
| `router.tsx` | Member 1 owns it; others open issues to request route additions |
| `app.ts` | Member 1 owns it; module owners register routes via their own `index.ts` |
| `package.json` | Never add deps without team approval + Member 1 implements |
| Models | Each model has one owner; never define same entity twice |
| Shared components | Request Member 1 to create; don't improvise locally |
| `globals.css` | Member 1 owns; use Tailwind classes instead of new CSS |

---

## Emergency Fixes

For urgent production bugs:

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b fix/auth/critical-token-bug

# Fix, test, commit
git commit -m "fix(auth): resolve token expiry calculation error"

# PR to main (with Member 1 approval)
# Then also merge into develop
```

---

## Useful Git Commands

```bash
# See all branches
git branch -a

# See commit history
git log --oneline --graph --decorate

# Discard all local changes (dangerous!)
git checkout -- .

# Interactive rebase (clean up commits before PR)
git rebase -i HEAD~3

# Stash changes temporarily
git stash
git stash pop

# Delete a local branch after merging
git branch -d feat/quotations/my-feature

# Delete a remote branch after merging
git push origin --delete feat/quotations/my-feature
```
