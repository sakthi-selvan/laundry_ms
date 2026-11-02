# Laundry Desk

Windows desktop management software for a laundry and dry-cleaning shop. It uses Electron, React, TypeScript, SQLite, Drizzle schema definitions, Zod IPC validation, PDFKit receipts, ExcelJS exports, and Electron Builder.

## Tamil Nadu features

- English/தமிழ் interface switch plus English, Tamil, or bilingual receipts and WhatsApp messages
- Order-specific UPI QR codes containing the exact outstanding balance
- Per-piece and per-kilogram price lists with decimal weight billing
- Customer membership plans, automatic percentage discounts, validity periods, and prepaid wallets
- Manual WhatsApp Click-to-Chat fallback plus optional local linked-device automation for consented transactional updates

Configure the shop UPI ID and customer communication language under **Settings**. Memberships can be activated from the customer list. Existing databases are migrated automatically; historical orders remain piece-based and retain their recorded prices.

## WhatsApp connection modes

The default manual mode opens a prepared message for an employee to review and send. Settings also contains an opt-in **Automatic WhatsApp** mode. The shop scans a linked-device QR code once; the session credentials are stored under Electron's local `userData` directory, order confirmations and ready notices are sent for opted-in customers, and every attempt is logged. Protect the Windows account and application-data folder because these credentials can access the linked WhatsApp session.

Automatic QR mode uses the community-maintained Baileys WhatsApp Web protocol. It is not an official Meta API and may be logged out, broken by protocol changes, or cause the number to be restricted. Never use it for marketing or bulk messaging. The official WhatsApp Business Platform is the recommended production integration. The manual Click-to-Chat path remains available if automation is disabled or disconnected.

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
