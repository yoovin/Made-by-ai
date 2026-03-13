export type PasswordGeneratorOptions = {
  lengthInput: string;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
};

export type PasswordGeneratorResult =
  | {
      ok: true;
      password: string;
      length: number;
      selectedGroups: string[];
      characterPoolSize: number;
    }
  | {
      ok: false;
      error: string;
    };

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

const CHARACTER_GROUPS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
} as const;

export const DEFAULT_PASSWORD_OPTIONS: PasswordGeneratorOptions = {
  lengthInput: "16",
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
};

type SelectedGroup = {
  label: string;
  characters: string;
};

function parseLength(lengthInput: string) {
  const trimmed = lengthInput.trim();
  if (!trimmed) {
    return {
      ok: false as const,
      error: `길이는 ${MIN_PASSWORD_LENGTH}부터 ${MAX_PASSWORD_LENGTH} 사이의 숫자로 입력해 주세요.`,
    };
  }

  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed)) {
    return {
      ok: false as const,
      error: `길이는 ${MIN_PASSWORD_LENGTH}부터 ${MAX_PASSWORD_LENGTH} 사이의 정수만 입력할 수 있습니다.`,
    };
  }

  if (parsed < MIN_PASSWORD_LENGTH || parsed > MAX_PASSWORD_LENGTH) {
    return {
      ok: false as const,
      error: `길이는 ${MIN_PASSWORD_LENGTH}부터 ${MAX_PASSWORD_LENGTH} 사이여야 합니다.`,
    };
  }

  return {
    ok: true as const,
    value: parsed,
  };
}

function getSelectedGroups(options: PasswordGeneratorOptions): SelectedGroup[] {
  const selectedGroups: SelectedGroup[] = [];

  if (options.includeUppercase) {
    selectedGroups.push({ label: "대문자", characters: CHARACTER_GROUPS.uppercase });
  }

  if (options.includeLowercase) {
    selectedGroups.push({ label: "소문자", characters: CHARACTER_GROUPS.lowercase });
  }

  if (options.includeNumbers) {
    selectedGroups.push({ label: "숫자", characters: CHARACTER_GROUPS.numbers });
  }

  if (options.includeSymbols) {
    selectedGroups.push({ label: "기호", characters: CHARACTER_GROUPS.symbols });
  }

  return selectedGroups;
}

function getCryptoApi() {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi || typeof cryptoApi.getRandomValues !== "function") {
    return null;
  }

  return cryptoApi;
}

function getRandomIndex(max: number, cryptoApi: Crypto) {
  if (max <= 0) {
    return 0;
  }

  const limit = Math.floor(256 / max) * max;

  while (true) {
    const values = cryptoApi.getRandomValues(new Uint8Array(1));
    const value = values[0];

    if (value < limit) {
      return value % max;
    }
  }
}

function pickRandomCharacter(characters: string, cryptoApi: Crypto) {
  return characters.charAt(getRandomIndex(characters.length, cryptoApi));
}

function shuffleCharacters(characters: string[], cryptoApi: Crypto) {
  const result = [...characters];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomIndex(index + 1, cryptoApi);
    const current = result[index];
    result[index] = result[swapIndex];
    result[swapIndex] = current;
  }

  return result;
}

export function generatePassword(options: PasswordGeneratorOptions): PasswordGeneratorResult {
  const parsedLength = parseLength(options.lengthInput);
  if (!parsedLength.ok) {
    return parsedLength;
  }

  const selectedGroups = getSelectedGroups(options);
  if (selectedGroups.length === 0) {
    return {
      ok: false,
      error: "최소 한 가지 문자 종류를 선택해 주세요.",
    };
  }

  const cryptoApi = getCryptoApi();
  if (!cryptoApi) {
    return {
      ok: false,
      error: "현재 환경에서는 안전한 비밀번호를 생성할 수 없습니다.",
    };
  }

  if (parsedLength.value < selectedGroups.length) {
    return {
      ok: false,
      error: "선택한 문자 종류 수보다 짧은 길이는 사용할 수 없습니다.",
    };
  }

  const allCharacters = selectedGroups.map((group) => group.characters).join("");
  const passwordCharacters = selectedGroups.map((group) => pickRandomCharacter(group.characters, cryptoApi));

  while (passwordCharacters.length < parsedLength.value) {
    passwordCharacters.push(pickRandomCharacter(allCharacters, cryptoApi));
  }

  const shuffledPassword = shuffleCharacters(passwordCharacters, cryptoApi).join("");

  return {
    ok: true,
    password: shuffledPassword,
    length: shuffledPassword.length,
    selectedGroups: selectedGroups.map((group) => group.label),
    characterPoolSize: allCharacters.length,
  };
}
