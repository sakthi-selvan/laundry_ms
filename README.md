# Laundry Desk

Windows desktop management software for a laundry and dry-cleaning shop. It uses Electron, React, TypeScript, SQLite, Drizzle schema definitions, Zod IPC validation, PDFKit receipts, ExcelJS exports, and Electron Builder.

## Development

```bash
npm install
npm run dev
```

The seeded administrator login is `admin123`. Change it from the Admin Panel after first launch.

## Build a Windows installer

Run this on Windows (or in a Windows build runner):

```bash
npm run dist:win
```

Customer data is stored under Electron's Windows `userData` directory, outside the installation folder. Uninstalling does not silently remove it.

## Licensing boundary

The app includes installation identity, local license state, expiry UI, offline grace-period storage, and administrative activation. A production deployment must connect these to a separately hosted validation service that returns signed license payloads and authoritative server time. Laundry/customer records remain local and must never be sent to that service.
