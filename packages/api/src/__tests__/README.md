# Workspace Module Test Suite

Test suite following the **Test Pyramid Strategy** based on `workspace-test-plan.md` and `workspace-api-spec.md`.

## Test Distribution

- **Unit Tests (60%)**: `src/__tests__/unit/`
  - `workspace.service.test.ts` - Workspace service logic
  - `member.service.test.ts` - Member service logic

- **Integration Tests (35%)**: `src/__tests__/integration/`
  - `workspace.api.test.ts` - API + Database integration

- **E2E Tests (5%)**: `src/__tests__/e2e/`
  - `workspace.e2e.test.ts` - Complete user flows

## Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run E2E tests only
npm run test:e2e

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

## Test Coverage

Target: **80% line coverage** for workspace module

### Test Cases Implemented

#### TC-WS-01: Create Workspace
- ✅ WS-01-01: Create workspace successfully
- ✅ WS-01-02: Fail with missing name
- ✅ WS-01-04: Fail with invalid slug
- ✅ WS-01-07: Fail without auth

#### TC-WS-02: List Workspaces
- ✅ WS-02-01: Return user workspaces
- ✅ WS-02-02: Return empty array for new user
- ✅ WS-02-04: Fail without auth

#### TC-WS-03: Get Workspace Details
- ✅ WS-03-01: Return workspace for member
- ✅ WS-03-02: Return null for non-member
- ✅ WS-03-03: Return 404 for non-existent

#### TC-WS-04: Update Workspace
- ✅ WS-04-01: Allow admin to update
- ✅ WS-04-03: Reject member update
- ✅ WS-04-06: Accept empty body

#### TC-WS-05: Delete Workspace
- ✅ WS-05-01: Soft delete workspace
- ✅ WS-05-02: Reject member delete
- ✅ WS-05-04: Verify soft delete

#### TC-WS-06: Invite Member
- ✅ WS-06-01: Invite with valid email
- ✅ WS-06-03: Fail with invalid email
- ✅ WS-06-05: Reject duplicate email

#### TC-WS-07: List Members
- ✅ WS-07-01: List all members
- ✅ WS-07-02: Filter by status

#### TC-WS-08: Update Member Role
- ✅ WS-08-01: Update member role

#### TC-WS-09: Remove Member
- ✅ WS-09-01: Remove member
- ✅ WS-09-03: Allow self-removal

#### Security Tests
- ✅ SEC-01: Reject without auth header
- ✅ EDGE-03: Reject empty name

## Prerequisites

1. PostgreSQL database running on `localhost:5433`
2. Database URL in `.env` file
3. Test user created in database

## Environment Variables

```env
DATABASE_URL=postgres://admin:admin@localhost:5433/kanban_db
API_URL=http://localhost:3000
```

## Test Fixtures

Located in `src/__tests__/fixtures.ts`:
- Test users (admin, member, guest, outsider)
- Test workspaces
- Test member invitations

## Test Utilities

Located in `src/__tests__/utils/test-helpers.ts`:
- `createTestUser()` - Create test user
- `createTestWorkspace()` - Create test workspace
- `cleanupTestData()` - Clean up after tests
- `getWorkspaceWithMembers()` - Query workspace with relations
