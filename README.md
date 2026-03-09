# Stamp Monitor

Monitors Swarm postage stamp expiry dates by reading on-chain data from the Gnosis Chain and sends email reports to
project maintainers.

## Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/)
- A [Resend](https://resend.com/) account (free tier) for email reports

## Installation

```bash
git clone https://github.com/Solar-Punk-Ltd/stamp-monitor.git
cd stamp-monitor
pnpm install
```

## Configuration

### Environment variables

Copy the sample and fill in your values:

```bash
cp .env.sample .env
```

| Variable              | Description                                         | Default                                 |
| --------------------- | --------------------------------------------------- | --------------------------------------- |
| `GNOSIS_RPC_URL`      | Gnosis Chain RPC endpoint                           | `https://rpc.gnosischain.com/`          |
| `REQUEST_DELAY_MS`    | Delay between RPC calls (ms) to avoid rate limiting | `1000`                                  |
| `RESEND_API_KEY`      | Your Resend API key                                 | —                                       |
| `RESEND_FROM_ADDRESS` | Sender address for email reports                    | `Stamp Monitor <onboarding@resend.dev>` |

### Stamp files

Place JSON files in the `stamps/` directory. Files starting with `example` are ignored at runtime.

Each JSON file defines a project and its stamps:

```json
{
  "project": "My Project PROD",
  "subject": "Stamp Status Update - My Project PROD",
  "maintainerAddress": "maintainer@example.com",
  "stamps": [
    {
      "name": "Public 1",
      "description": "port 4833",
      "batchId": "0x1234..."
    }
  ]
}
```

| Field                  | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `project`              | Project name (used in logs and email heading)       |
| `subject`              | Email subject line                                  |
| `maintainerAddress`    | Email recipient for this project's report           |
| `stamps[].name`        | Stamp display name (e.g. "Private 1", "Public 2")   |
| `stamps[].description` | Additional info (e.g. port number, tags)            |
| `stamps[].batchId`     | Postage batch ID (hex, with or without `0x` prefix) |

See `stamps/example1.json` and `stamps/example2.json` for reference.

## Usage

### Run directly (development)

```bash
pnpm start
```

### Output

The tool logs each project's stamp status to the console:

```
=== My Project PROD ===
  Public 1 | port 4833 | 0x1234... | valid: true | expiry: 2026-05-01T12:00:00.000Z | immutable: true
  Private 1 | port 5133 | 0x5678... | valid: true | expiry: 2026-04-15T08:30:00.000Z | immutable: false
```

Then sends an HTML email report to each project's `maintainerAddress`.

## Deployment

### Create the bundle

```bash
pnpm bundle
```

This produces a `bundle/` folder containing everything needed to run:

```
bundle/
  index.js      # single file with all dependencies bundled
  stamps/       # your stamp JSON files
  .env          # environment variables (from your local .env)
```

### Deploy to a server

Copy the bundle to your server:

```bash
scp -r bundle/ user@server:/opt/stamp-monitor
```

Add your stamp JSON files to the `stamps/` directory and remove the example files.

Run it:

```bash
cd /opt/stamp-monitor
node index.js
```

## Scheduling

### Option A: cron

```bash
crontab -e
```

Add a line to run daily at 8:00 AM:

```cron
0 8 * * * cd /opt/stamp-monitor && /usr/local/bin/node index.js >> /var/log/stamp-monitor.log 2>&1
```

Replace paths with your actual values. Use `which node` to find the Node.js path.

Verify:

```bash
crontab -l
```

### Option B: PM2

Install PM2 globally if you haven't already:

```bash
npm install -g pm2
```

Start with a cron schedule (e.g. daily at 8:00 AM):

```bash
cd /opt/stamp-monitor
pm2 start index.js --name stamp-monitor --cron-restart="0 8 * * *" --no-autorestart
```

- `--cron-restart` triggers a restart on the given cron schedule
- `--no-autorestart` prevents PM2 from restarting the process after it exits (since this is a one-shot script, not a long-running server)

Persist across reboots:

```bash
pm2 save
pm2 startup
```

Useful PM2 commands:

```bash
pm2 list                    # view all processes
pm2 logs stamp-monitor      # view logs
pm2 delete stamp-monitor    # remove the process
```

### Useful cron patterns

| Schedule | Expression |
|---|---|
| Every day at 8:00 AM | `0 8 * * *` |
| Every 12 hours | `0 */12 * * *` |
| Every Monday at 9:00 AM | `0 9 * * 1` |
| Every 6 hours | `0 */6 * * *` |
