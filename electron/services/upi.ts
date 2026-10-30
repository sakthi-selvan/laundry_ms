import QRCode from 'qrcode';
import type { OrderDetail, ShopSettings } from '../../shared/types.js';

export function createUpiUri(order: OrderDetail, settings: ShopSettings) {
  if (!settings.upiId.trim()) return '';
  const params = new URLSearchParams({
    pa: settings.upiId.trim(), pn: settings.upiPayeeName.trim() || settings.shopName,
    am: order.balance.toFixed(2), cu: 'INR', tn: `${settings.shopName} ${order.orderNumber}`
  });
  return `upi://pay?${params.toString()}`;
}

export async function createUpiQr(order: OrderDetail, settings: ShopSettings) {
  const uri = createUpiUri(order, settings);
  return { uri, qrDataUrl: uri ? await QRCode.toDataURL(uri, { width: 360, margin: 1, errorCorrectionLevel: 'M' }) : '', amount: order.balance, configured: Boolean(uri) };
}
