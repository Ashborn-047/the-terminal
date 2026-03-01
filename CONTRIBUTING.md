# Contributing to The Terminal

First off, thanks for taking the time to contribute! ❤️

The Terminal is an open-source, gamified Linux simulator. We love pull requests from everyone. By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs
If you find a bug, please open an issue in the GitHub repository. Include:
- A clear and descriptive title.
- Steps to reproduce the bug.
- Expected behavior vs actual behavior.
- Screenshots if applicable.
- Your browser and OS information.

### Suggesting Enhancements
Have an idea for a new command, a new lab, or a UI improvement? Open an issue! 
- Tag it as an `enhancement`.
- Describe the feature in detail.
- Explain why this enhancement would be useful.

### Contributing Code or Labs
We welcome PRs for:
- **New Commands:** Implement missing Linux commands in `src/features/command-engine`.
- **New Labs:** Create new guided or DIY challenges in `src/data/labs`.
- **UI/UX Polish:** Enhance the Neo-Brutalist design.
- **Bug Fixes:** Squash those bugs!

## Getting Started for Developers

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/the-terminal.git
   cd the-terminal
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/my-awesome-feature
   ```
5. **Run the development server:**
   ```bash
   npm run dev
   ```

## Pull Request Guidelines

- **Keep it focused:** Don't bundle unrelated changes into a single PR.
- **Explain your changes:** Write a good PR description explaining *what* changed and *why*.
- **Write tests:** If you add a new command or VFS feature, please add basic unit tests using Vitest (`npm test`).
- **Follow the style:** Ensure your code matches the existing style (React functional components, standard TypeScript, Neo-Brutalist Tailwind utility classes).
- **Run the linter:** Ensure your code passes linting (`npm run lint`).

## Creating New Labs

Adding labs is easy! Labs are defined as JSON objects in `src/data/labs`. 
Look at `src/data/labs/1-basics.ts` for an example of a Guided lab, and `src/data/labs/1-basics-challenge.ts` for a DIY lab. 

Make sure your lab:
- Has a clear description and objectives.
- Includes appropriate hints.
- Awards XP (`100` for DIY, `50` for Guided).
- Contains strictly valid verification conditions for DIY labs.

## Need Help?
If you are stuck on an issue or need guidance on how to implement a feature, don't hesitate to ask for help in the comments of the issue you are working on!

Happy Hacking! 👩‍💻👨‍💻
