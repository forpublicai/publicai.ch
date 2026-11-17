# Progress dashboard data

The `/progress` page (`content/cooperative/progress.mdx`) renders `src/data/progress.json`. This folder holds the scripts that collect the numbers and build that file. All scripts use the Python standard library only.

| Script               | Source                                                                                                         | Writes                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `litellm_usage.py`   | LiteLLM `/team/daily/activity` (`--api`) or the admin UI's "team usage daily with models" CSV export (`--csv`) | `raw/litellm_usage.json` (gitignored, about 2 MB) |
| `openwebui_stats.py` | Open WebUI admin API on chat.publicai.co: user list sorted by sign-up date, `/api/v1/analytics/summary`        | `snapshots/openwebui_stats.json`                  |
| `build_progress.py`  | everything in `snapshots/` plus `raw/litellm_usage.json`                                                       | `src/data/progress.json`                          |

The other snapshots were pulled through connectors and are refreshed by hand or by a scheduled task:

- `co_monthly.json`, `co_windows.json`: Vercel Web Analytics, project `publicai-landing` (publicai.co).
- `hello_threads.json`, `support_threads.json`: Gmail thread dates only, no senders.
- `github_issues.json`: issues in `forpublicai` repositories since launch.
- `coverage.json`: what each metric is built from and what is missing.

## Refresh

```bash
python3 tools/progress/litellm_usage.py --api https://api-internal.publicai.co --out tools/progress/raw/litellm_usage.json
python3 tools/progress/openwebui_stats.py --api https://chat.publicai.co --as-of 2026-11-16 --out tools/progress/snapshots/openwebui_stats.json
python3 tools/progress/build_progress.py --as-of 2026-11-16
```

Keys come from `LITELLM_API_KEY` (a `proxy_admin_viewer` key) and `OPENWEBUI_API_KEY` (an admin key), or from a network proxy that injects them. Never commit keys.

Known issues on 17 Nov 2026:

- LiteLLM returns HTTP 500 for every authenticated request, including `/v1/models`, so `--api` has not run yet; the current data comes from the CSV export.
- Cloudflare refuses Python's default user agent (error 1010), so the scripts send their own.

## Windows

Last 30 days and past 12 months end on `--as-of`, inclusive. Since launch starts on 2 September 2025. Update the dates in the page's opening paragraph when you change `--as-of`.
