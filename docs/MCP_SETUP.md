## MCP tools setup for this project

This project already includes a TalkToFigma MCP server entry in `.cursor/mcp.json`. The sections below describe optional MCP servers useful for day-to-day work. Replace placeholders with your values.

### 1) GitHub MCP (issues/PR automation)
- Purpose: create/update issues, open PRs from branches, add labels/reviewers, read repo metadata.
- Requirements: GitHub Personal Access Token with `repo` scope.

Example config snippet (add to `.cursor/mcp.json` under `mcpServers`):
```json
"GitHub": {
  "command": "node",
  "args": ["./mcp-servers/github/build/index.js"],
  "env": {
    "GITHUB_TOKEN": "YOUR_GITHUB_TOKEN",
    "GITHUB_REPOSITORY": "daehee719/macchain-bible-app"
  }
}
```
Notes:
- This assumes a local GitHub MCP server at `mcp-servers/github`. If you use a different server/binary, update `command`/`args` accordingly.

### 2) Cloudflare MCP (Workers/Pages/D1 ops)
- Purpose: deploy Workers, inspect bindings, tail logs, manage Pages builds, query D1.
- Requirements: `CLOUDFLARE_API_TOKEN` (with appropriate permissions), `CLOUDFLARE_ACCOUNT_ID`.

Example config snippet:
```json
"Cloudflare": {
  "command": "node",
  "args": ["./mcp-servers/cloudflare/build/index.js"],
  "env": {
    "CLOUDFLARE_API_TOKEN": "YOUR_CF_API_TOKEN",
    "CLOUDFLARE_ACCOUNT_ID": "YOUR_CF_ACCOUNT_ID"
  }
}
```

### 3) SQLite/D1 MCP (local SQL validation)
- Purpose: run local SQL against a SQLite file for fast validation of `backend/cloudflare-workers/database/schema.sql`.
- Requirements: path to a local SQLite database or an ephemeral one.

Example config snippet:
```json
"SQLite": {
  "command": "node",
  "args": ["./mcp-servers/sqlite/build/index.js"],
  "env": {
    "SQLITE_DB_PATH": "./dev.db"
  }
}
```

### 4) Notion MCP (project docs, sprint notes)
- Purpose: create/read/update Notion pages for sprint notes, retro, deployment checklists.
- Requirements: Notion internal integration token.
- Reference: `docs/NOTION_MCP_SETUP.md`, `scripts/setup-notion-mcp.sh`.

Example config snippet:
```json
"Notion": {
  "command": "node",
  "args": ["./mcp-notion-server/build/index.js"],
  "env": { "NOTION_API_TOKEN": "YOUR_NOTION_TOKEN" }
}
```

### How to enable
1. Pick the servers you want, ensure the corresponding server binary or project is available locally.
2. Merge the snippet(s) into `.cursor/mcp.json` under the `mcpServers` key.
3. Set environment variables securely (shell profile or secret manager).
4. Restart Cursor to pick up the updated MCP config.
