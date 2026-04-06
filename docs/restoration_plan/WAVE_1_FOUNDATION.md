# Wave 1: The Foundation (Core Integrity & Safety)

## 1. Primary Objectives
Wave 1 focuses on the **VFS Data Model** and **Core Security Layer**. Without a high-fidelity filesystem, the shell logic (Wave 2) and curriculum (Wave 3) will be built on sand.

---

## 2. Technical Blueprints (Details & Sub-Details)

### 2.1. Inode/Dentry Decoupling (P0)
**The Problem:** Currently, the "inode" and "dentry" (directory entry) are the same object. This prevents true hardlinks (multiple names pointing to one data source).

#### **What:**
Separate the storage of file *metadata* (Inode) from file *names* (Dentry) within the VFS backend.

#### **Why:**
To achieve 1:1 parity with Linux VFS. It allows `ln file1 file2` to work correctly, where modifying `file2` changes the content of `file1`.

#### **How:**
1.  **Introduce an Inode Table:** A global lookup map in the VFS state.
2.  **Refactor the Dentry Tree:** Each Dentry node will now contain a `name`, `parentId`, and `inodeId`. 
3.  **Migration Path:** A script to convert existing "flat" JSON snapshots into the new Inode-aware schema.

#### **Sub-Details:**
*   **Permissions:** Move `owner`, `group`, and `mode` into the Inode object.
*   **Timestamps:** Track `atime`, `mtime`, and `ctime` at the Inode level.
*   **Link Count:** Track `nlink` (number of dentries pointing to this inode). Delete the Inode data only when `nlink == 0`.

---

### 2.2. $O(1)$ Path Resolution & Performance (P0)
**The Problem:** `findParentId()` and other recursive path lookups are $O(n)$ linear scans. Traversing a 10-level deep directory triggers multiple scans, leading to visible terminal jitter.

#### **What:**
Implement an **Index Map** for rapid node resolution.

#### **Why:**
As the classroom labs scale to 1,000+ files (e.g., in `syslog` or `dev` simulations), $O(n)$ lookup will crash the client performance.

#### **How:**
Introduce a `Map<InodeId, Dentry[]>` for reverse lookups and a `Map<PathString, InodeId>` for path caching (with cache invalidation on `rm`/`mv`).

---

### 2.3. Dependency Hardening (CVE Fixes) (P1)
**The Problem:** Critical vulnerabilities in `lodash`, `tar`, and `undici` threaten the stability of the build and safety of user sessions.

#### **What:**
Execute a surgical dependency audit and upgrade.

#### **Who:**
DevOps/Tooling (AI Agent).

---

## 3. Bottleneck Analysis & Overcoming Challenges

| Setback | Bottleneck | How to Overcome |
|---|---|---|
| **Hardlinks Fail** | Current code assumes 1 File = 1 Metadata Object. | **The Split:** Move metadata to `Inodes` and names to `Dentries`. |
| **Input Lag** | Deeply nested directory resolution is slow. | **The Index:** Move from search loops to Hash Map lookups. |
| **Memory Leaks** | Signal listeners (SIGINT) are not cleaned up on exit. | **The Registry:** Implement a `SignalRegistry` that auto-unsubscribes on command termination. |

---

## 4. Do's and Don'ts

### ✅ Do's:
*   **Do** ensure that `stat -c %i [file]` returns the correct Inode ID.
*   **Do** verify that `ls -li` shows identical Inode IDs for hardlinked files.
*   **Do** write unit tests for the "Hardlink Update" scenario (Write to link A, read from link B).
*   **Do** use TypeScript's strictly typed `InodeId` and `DentryId` (Opaque types).

### ❌ Don'ts:
*   **Don't** allow "shallow copies" of Inode objects.
*   **Don't** use string manipulation for path resolution if an object-based tree is available.
*   **Don't** merge Wave 1 without a "Snapshot Cleanliness" verification.

---

## 5. Expected vs. Desired Outcomes

| Type | Outcome Definition |
|---|---|
| **Probable** | The `ln` command actually creates a link instead of a copy. |
| **Expected** | Terminal input lag is reduced by >80% for deep path operations. |
| **Desired** | Total separation of VFS concern, enabling the Authoritative Rust backend (Wave 2). |

---

## 6. Watch Out For:
> [!CAUTION]
> **Snapshot Corruption:** Introducing the Inode Table will break all existing user snapshots. We MUST provide a migration bridge or a "Reset Environment" warning before deployment.
