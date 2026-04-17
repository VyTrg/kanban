import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock database before importing services
vi.mock('../../config/database', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

import { MemberService } from '../../services/member.service';
import { db } from '../../config/database';
import { fixtures } from '../fixtures';

describe('MemberService - Unit Tests', () => {
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TC-WS-06: Invite Member', () => {
    it('WS-06-01: should invite member with valid email', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{ workspace: { id: 1 } }]),
            }),
          }),
        }),
      });

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{ workspace: { id: 1 } }]),
            }),
          }),
        }),
      }).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      mockDb.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{
            publicId: 'mem_123',
            email: 'invite@test.com',
            role: 'member',
            status: 'invited',
          }]),
        }),
      });

      (db as any).select = mockDb.select;
      (db as any).insert = mockDb.insert;

      const result = await MemberService.invite('ws_1', fixtures.users.admin.id, {
        email: 'invite@test.com',
        role: 'member',
      });

      expect(result.status).toBe('invited');
      expect(result.email).toBe('invite@test.com');
    });

    it('WS-06-05: should reject duplicate email', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{ workspace: { id: 1 } }]),
            }),
          }),
        }),
      }).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ email: 'existing@test.com' }]),
          }),
        }),
      });

      (db as any).select = mockDb.select;

      await expect(
        MemberService.invite('ws_1', fixtures.users.admin.id, {
          email: 'existing@test.com',
          role: 'member',
        })
      ).rejects.toThrow('đã là thành viên');
    });
  });

  describe('TC-WS-07: List Members', () => {
    it('WS-07-01: should list all members', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{ workspace: { id: 1 } }]),
            }),
          }),
        }),
      }).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            { publicId: 'mem_1', role: 'admin', status: 'active' },
            { publicId: 'mem_2', role: 'member', status: 'invited' },
          ]),
        }),
      });

      (db as any).select = mockDb.select;

      const result = await MemberService.list('ws_1', fixtures.users.admin.id);

      expect(result).toHaveLength(2);
    });

    it('WS-07-02: should filter by status', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{ workspace: { id: 1 } }]),
            }),
          }),
        }),
      }).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            { publicId: 'mem_2', status: 'active' },
          ]),
        }),
      });

      (db as any).select = mockDb.select;

      const result = await MemberService.list('ws_1', fixtures.users.admin.id, { status: 'active' });

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('active');
    });
  });

  describe('TC-WS-08: Update Member Role', () => {
    it('WS-08-01: should update member role', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{ workspace: { id: 1 } }]),
            }),
          }),
        }),
      });

      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ role: 'guest' }]),
          }),
        }),
      });

      (db as any).select = mockDb.select;
      (db as any).update = mockDb.update;

      const result = await MemberService.updateRole('ws_1', 'mem_1', fixtures.users.admin.id, {
        role: 'guest',
      });

      expect(result[0].role).toBe('guest');
    });
  });

  describe('TC-WS-09: Remove Member', () => {
    it('WS-09-01: should remove member', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{ workspace: { id: 1 } }]),
            }),
          }),
        }),
      }).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 1, userId: 'other-user' }]),
          }),
        }),
      }).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{ workspace: { id: 1 } }]),
            }),
          }),
        }),
      });

      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ status: 'removed' }]),
          }),
        }),
      });

      (db as any).select = mockDb.select;
      (db as any).update = mockDb.update;

      const result = await MemberService.remove('ws_1', 'mem_1', fixtures.users.admin.id);

      expect(result[0].status).toBe('removed');
    });

    it('WS-09-03: should allow self-removal', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{ workspace: { id: 1 } }]),
            }),
          }),
        }),
      }).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 1, userId: fixtures.users.member.id }]),
          }),
        }),
      });

      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ status: 'removed' }]),
          }),
        }),
      });

      (db as any).select = mockDb.select;
      (db as any).update = mockDb.update;

      const result = await MemberService.remove('ws_1', 'mem_1', fixtures.users.member.id);

      expect(result[0].status).toBe('removed');
    });
  });
});
