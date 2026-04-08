# Wave 1 Gap Analysis: VFS & Foundation Restoration

| Feature | Status | Current Code Location | Notes |
| :--- | :--- | :--- | :--- |
| **POSIX VFS Core** | ✅ Complete | `src/features/vfs/vfs.ts` | Implements Inode/Dentry separation and path resolution. |
| **Inode Table** | ✅ Complete | `src/features/vfs/InodeTable.ts` | Fully decoupled from Dentry tree. |
| **RBAC Permissions** | ✅ Complete | `vfs.ts` (hasPermission) | Supports User/Group/Others model. |
| **Octal Mode Parsing** | ✅ Complete | `vfs.ts` (parseOctalMode) | Required for standard `chmod` behavior. |
| **Soft/Hard Links** | ✅ Complete | `src/features/command-engine/commands/ln.ts` | Integrated with Inode linking logic. |
| **Sticky Bit** | ⚠️ Partial | `vfs.ts` | Logic exists in permissions check, but needs enforcement audit in `rm` and `mv`. |
| **Umask Enforcement** | ⚠️ Partial | `vfs.ts` | Implemented in VFS but not yet persisted across session reloads. |
| **ACL Support** | ❌ Missing | N/A | Advanced Access Control Lists deferred from original Foundation spec. |
| **Basic Commands** | ✅ Complete | `src/features/command-engine/commands/*` | `ls`, `cat`, `rm`, `mv`, `cp`, `mkdir`, `chmod`, `chown`, `ln` fully migrated. |

---

### Wave 1 Summary
The Foundation is solid. The primary gaps are advanced POSIX features (ACLs) and ensuring that the `umask` state is persisted in the global SpacetimeDB or localStorage state.
