# Linux Mastery Track: Chapter Evolution Plan

The goal is to transition the current curriculum from a certification-focused "exam prep" feel to a **Mastery-focused** educational journey. Each chapter will be a self-contained deep dive into Linux internals and professional practices.

## 1. Structural Evolution
Currently, chapters follow a simple [Title -> Sections] structure. To meet the "Mastery" standard, we will evolve the data model to support:

| Component | Purpose | Mastery Impact |
|-----------|---------|----------------|
| **Conceptual Core** | 4-5 paragraphs of high-level theory. | Deep understanding of "Why" before "How". |
| **Technical Deep-Dive** | Detailed command syntax and internal mechanics. | Moving beyond surface-level usage. |
| **Interactive Scenarios** | "Try it now" micro-labs (in-browser terminal). | Immediate application of knowledge. |
| **Use-Case Showcases** | Real-world administrative scenarios. | Contextualizing skills for professional work. |
| **Common Pitfalls** | "What NOT to do" and troubleshooting tips. | Building resilience and error-awareness. |

## 2. Content Expansion Roadmap

### 🏁 Foundational Track (Chapters 1-15)
- **Focus**: Core system mechanics, filesystem navigation, and basic administration.
- **Mastery Upgrade**: 
    - Replace generic "Enterprise Linux" branding with "Universal Linux Mastery".
    - Add "Under the Hood" sections (e.g., explaining Inodes in Ch 2, Process signals in Ch 7).
    - Expand examples from one-liners to complex pipelines.

### 🚀 Advanced Track (Chapters 16+)
- **Focus**: Automation, Security (SELinux), Networking, and Orchestration.
- **Mastery Upgrade**:
    - **Scripting**: Move from "Hello World" to robust error-handling and log-parsing scripts.
    - **Security**: Focus on *least privilege* and *defense in depth* rather than just permissions.
    - **Storage**: Comprehensive coverage of LVM, Stratis, and VDO with data loss prevention scenarios.

## 3. The "Mastery Cycle" (UX Flow)
1.  **Reading Phase**: Enforced high-fidelity content delivery. No "skipping" to MCQ.
2.  **Guided Drill**: A mini-terminal scenario where users execute the chapter's "Showcase" commands.
3.  **Knowledge Assessment (MCQ)**: Challenging questions that test edge cases, not just basic syntax.
4.  **Mastery Certification (Lab)**: A "Broken System" lab that requires applying the chapter's skills to fix a real issue.

## 4. Immediate Next Steps
1.  **Rewrite Chapters 3-15**: Apply the expanded template (4-5 paragraphs, subtopics, etc.) to all remaining foundational chapters.
2.  **Genericize Branding**: Ensure no "Red Hat" or "Enterprise" terminology remains in the educational text.
3.  **Sync with Lab Engine**: Ensure each chapter has a corresponding "Mastery Lab" in the Challenge Arena.

---
*"We don't teach you how to pass a test. We teach you how to master the system."*
