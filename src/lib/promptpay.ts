import QRCode from "qrcode";

/**
 * CRC-16 CCITT (0xFFFF) checksum calculation for EMVCo QR Code
 */
function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= (data.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatTag(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Generate standard Thai PromptPay EMVCo Payload
 * @param target Mobile number (e.g. '0812345678') or Tax ID (13 digits)
 * @param amount Total amount (THB)
 */
export function generatePromptPayPayload(target: string = "0812345678", amount?: number): string {
  const cleanTarget = target.replace(/[^0-9]/g, '');
  let merchantInfo = "";

  if (cleanTarget.length >= 13) {
    // Tax ID / National ID (13 digits)
    const sub00 = formatTag("00", "A000000677010111");
    const sub02 = formatTag("02", cleanTarget.slice(0, 13));
    merchantInfo = formatTag("29", sub00 + sub02);
  } else {
    // Phone number (e.g. 0812345678 -> 0066812345678)
    const formattedPhone = cleanTarget.startsWith('0')
      ? '0066' + cleanTarget.slice(1)
      : '0066' + cleanTarget;
    const sub00 = formatTag("00", "A000000677010111");
    const sub01 = formatTag("01", formattedPhone.padStart(13, '0'));
    merchantInfo = formatTag("29", sub00 + sub01);
  }

  let raw = "";
  raw += formatTag("00", "01"); // Payload Format Indicator
  raw += formatTag("01", amount && amount > 0 ? "12" : "11"); // 12 = Dynamic (with amount)
  raw += merchantInfo;
  raw += formatTag("53", "764"); // Currency THB (764)

  if (amount !== undefined && amount > 0) {
    const formattedAmount = amount.toFixed(2);
    raw += formatTag("54", formattedAmount);
  }

  raw += formatTag("58", "TH"); // Country code
  raw += "6304"; // CRC placeholder

  const crc = crc16(raw);
  return raw + crc;
}

/**
 * Generate QR Code Data URL from PromptPay Payload
 */
export async function generatePromptPayQrDataUrl(target: string = "0812345678", amount?: number): Promise<string> {
  const payload = generatePromptPayPayload(target, amount);
  return await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    margin: 2,
    scale: 8,
    color: {
      dark: '#002d62', // Deep Royal Navy Blue for authentic banking feel
      light: '#ffffff'
    }
  });
}
