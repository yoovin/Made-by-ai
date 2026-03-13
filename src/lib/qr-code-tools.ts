import QRCode from "qrcode";

export type QrCodeResult =
  | {
      ok: true;
      inputLength: number;
      dataUrl: string;
      copyText: string;
    }
  | {
      ok: false;
      error: string;
    };

const MAX_QR_INPUT_LENGTH = 512;

export async function generateQrCode(input: string): Promise<QrCodeResult> {
  const normalized = input.trim();

  if (!normalized) {
    return {
      ok: false,
      error: "QR 코드로 만들 텍스트를 입력해 주세요.",
    };
  }

  if (normalized.length > MAX_QR_INPUT_LENGTH) {
    return {
      ok: false,
      error: `이번 단계에서는 ${MAX_QR_INPUT_LENGTH}자 이하의 텍스트만 지원합니다.`,
    };
  }

  try {
    const dataUrl = await QRCode.toDataURL(normalized, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 320,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });

    return {
      ok: true,
      inputLength: normalized.length,
      dataUrl,
      copyText: normalized,
    };
  } catch {
    return {
      ok: false,
      error: "QR 코드를 생성할 수 없습니다.",
    };
  }
}
