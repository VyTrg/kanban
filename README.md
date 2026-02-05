# Trello clone with NextJS
> [!CAPTION] Read `docs/` before implementation
## Project Structure

* **app**: File-system based routes
* **components**: Components and widgets
* **database**: DB connection & querying
* **emails**: HTML email templates
* **functions**: React server functions
* **lib**: Cross-cutting utilities
* **public**: Images and static assets

---

## Commit Message Convention

Messages must follow the format:  
`<type>: <description>`  
`[optional body]`

### Types
* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation changes only
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
* **refactor**: A code change that neither fixes a bug nor adds a feature (renaming variables, splitting functions, removing redundant code)
* **perf**: A code change that improves performance
* **test**: Adding missing tests or correcting existing tests
* **build**: Changes that affect the build system or external dependencies
* **ci**: Changes to CI configuration files and scripts

### Description Rules
* **Length**: Keep it under 50 characters for readability on GitHub and other Git tools.
* **Mood**: Use the imperative, present tense (e.g., "change" instead of "changed").
* **Case**: Do not capitalize the first letter.
* **Punctuation**: Do not end the description with a period.

### Body (Optional)
* **Spacing**: Separate from the `<type>: <description>` with one blank line.
* **Content**: Use it to explain **What** is being done or **Why** it is necessary, rather than **How** the change was implemented.
