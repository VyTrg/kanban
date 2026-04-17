export const fixtures = {
  users: {
    admin: {
      id: "550e8400-e29b-41d4-a716-446655440000",
      email: "admin@test.com",
      name: "Admin User",
    },
    member: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      email: "member@test.com",
      name: "Member User",
    },
    guest: {
      id: "550e8400-e29b-41d4-a716-446655440002",
      email: "guest@test.com",
      name: "Guest User",
    },
    outsider: {
      id: "550e8400-e29b-41d4-a716-446655440003",
      email: "outsider@test.com",
      name: "Outsider User",
    },
  },
  workspaces: {
    active: {
      name: "Active Workspace",
      slug: "active-workspace",
      description: "Test workspace",
    },
    toDelete: {
      name: "To Delete Workspace",
      slug: "to-delete-workspace",
    },
  },
  members: {
    invite: {
      email: "invite@test.com",
      role: "member" as const,
    },
  },
};
