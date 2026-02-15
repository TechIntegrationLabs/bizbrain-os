# Find Command

Search across all Brain content using ripgrep.

## Usage

`/find <search-query>`

## Instructions

1. **Parse search query**
   - Extract search terms
   - Detect if it's a phrase (quoted) or keywords

2. **Execute multi-pass search**

   **Pass 1: High-priority content**
   - Search in: `{{BRAIN_PATH}}/Projects/`
   - Search in: `{{BRAIN_PATH}}/Clients/`
   - Search in: `{{BRAIN_PATH}}/Partners/`
   - Search in: `{{BRAIN_PATH}}/Operations/todos/`
   - File types: `*.md`, `*.json`, `*.txt`

   **Pass 2: Knowledge and config**
   - Search in: `{{BRAIN_PATH}}/.bizbrain/knowledge/`
   - Search in: `{{BRAIN_PATH}}/.claude/`
   - File types: `*.md`

   **Pass 3: Intake and history**
   - Search in: `{{BRAIN_PATH}}/_intake-dump/`
   - File types: `*.md`, `*.txt`, `*.json`

3. **Use Grep tool with appropriate parameters**
   ```
   pattern: <user-query>
   path: <search-path>
   output_mode: "content"
   context: 2
   head_limit: 50
   ```

4. **Organize results by relevance**
   - Group by folder (Projects, Clients, etc.)
   - Show file path, line number, matching content
   - Highlight search terms in context

5. **Display formatted results**

```
Found 12 matches for "client onboarding"

Projects/BuildTrack/_context/notes.md:
  23: Planning client onboarding flow for new users
  24: - Create onboarding checklist

Clients/Acme-Corp/_context/history.md:
  15: 2024-01-15: Completed onboarding call
  16: - Reviewed contract terms

Operations/todos/ACTIVE-TODOS.md:
  8: [ ] Finalize client onboarding documentation

Knowledge/systems/entity-system.md:
  45: Client onboarding process involves creating entity folder...

Showing 4 of 12 results. Refine search or view more?
```

6. **Suggest refinements**
   - If too many results: suggest narrowing by folder or file type
   - If no results: suggest related terms or broader search
   - Offer to search in archived content if needed

7. **Quick actions**
   - Offer to open relevant files
   - Offer to create todo from search results
   - Offer to load related knowledge

## Search Tips

Include in help output:
- Use quotes for exact phrases: `"client contract"`
- Use regex patterns: `client.*onboarding`
- Scope to folder: `/find "term" --scope Projects`
- Search by date: `/find "term" --since 2024-01`
