export type XmlFormatResult =
  | {
      ok: true;
      formatted: string;
      rootTag: string;
      lineCount: number;
      characterCount: number;
    }
  | {
      ok: false;
      error: string;
    };

function formatXmlString(xml: string) {
  const normalized = xml.replace(/>(\s*)</g, ">\n<");
  const lines = normalized.split("\n").map((line) => line.trim()).filter(Boolean);
  const formatted: string[] = [];
  let depth = 0;

  for (const line of lines) {
    const isClosing = /^<\//.test(line);
    const isSelfClosing = /\/?>$/.test(line) && /\/>$/.test(line);
    const isDeclaration = /^<\?/.test(line) || /^<!/.test(line);
    const isInlinePair = /^<[^/!?][^>]*>.*<\//.test(line);

    if (isClosing) {
      depth = Math.max(depth - 1, 0);
    }

    formatted.push(`${"  ".repeat(depth)}${line}`);

    if (!isClosing && !isSelfClosing && !isDeclaration && !isInlinePair) {
      depth += 1;
    }
  }

  return formatted.join("\n");
}

function extractXmlError(document: Document) {
  const parserError = document.getElementsByTagName("parsererror")[0];
  if (!parserError) {
    return null;
  }

  return parserError.textContent?.trim() || "유효하지 않은 XML입니다.";
}

export function formatXmlInput(input: string): XmlFormatResult {
  const normalized = input.trim();

  if (!normalized) {
    return {
      ok: false,
      error: "포맷할 XML을 입력해 주세요.",
    };
  }

  if (/(<!DOCTYPE|<!ENTITY)/i.test(normalized)) {
    return {
      ok: false,
      error: "이번 단계에서는 DTD/ENTITY 문법을 지원하지 않습니다.",
    };
  }

  if (typeof DOMParser === "undefined" || typeof XMLSerializer === "undefined") {
    return {
      ok: false,
      error: "이 환경에서는 XML 포맷을 지원하지 않습니다.",
    };
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(normalized, "application/xml");
  const parseError = extractXmlError(document);

  if (parseError) {
    return {
      ok: false,
      error: `유효하지 않은 XML입니다. ${parseError}`,
    };
  }

  const serializer = new XMLSerializer();
  let serialized = serializer.serializeToString(document);
  if (normalized.startsWith("<?xml") && !serialized.startsWith("<?xml")) {
    const declaration = normalized.match(/^<\?xml[^?]*\?>/);
    if (declaration) {
      serialized = `${declaration[0]}${serialized}`;
    }
  }

  const formatted = formatXmlString(serialized);

  return {
    ok: true,
    formatted,
    rootTag: document.documentElement.tagName,
    lineCount: formatted.split(/\r?\n/).length,
    characterCount: formatted.length,
  };
}
