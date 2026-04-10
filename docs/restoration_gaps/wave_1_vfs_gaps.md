# Wave 1 Gap Analysis: VFS & Foundation Restoration

| Feature | Status | Current Code Location | Notes |
| :--- | :--- | :--- | :--- |
| **POSIX VFS Core** | ✅ Complete | `src/features/vfs/vfs.ts` | Implements Inode/Dentry separation and path resolution. |
| **Inode Table** | ✅ Complete | `src/features/vfs/InodeTable.ts` | Fully decoupled from Dentry tree. |
| **RBAC Permissions** | ✅ Complete | `vfs.ts` (hasPermission) | Supports User/Group/Others model. |
| **Octal Mode Parsing** | ✅ Complete | `vfs.ts` (parseOctalMode) | Required for standard `chmod` behavior. |
| **Soft/Hard Links** | ✅ Complete | `src/features/command-engine/commands/ln.ts` | Integrated with Inode linking logic. |
| **Sticky Bit** | ✅ Complete | `vfs.ts` | Enforcement audit complete in `rm` and `mv`. |
| **Umask Enforcement** | ✅ Complete | `vfs.ts` | Persisted across session reloads via SpacetimeDB serialization. |
| **ACL Support** | ✅ Complete | `vfs.ts` | Foundation engine implemented with user/group override checks. |
| **Basic Commands** | ✅ Complete | `src/features/command-engine/commands/*` | `ls`, `cat`, `rm`, `mv`, `cp`, `mkdir`, `chmod`, `chown`, `ln` fully migrated. |

---

### Wave 1 Summary
The Foundation is solid. The primary gaps are advanced POSIX features (ACLs) and ensuring that the `umask` state is persisted in the global SpacetimeDB or localStorage state.
