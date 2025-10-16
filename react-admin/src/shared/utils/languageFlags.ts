// Language code to country flag emoji mapping
export const getLanguageFlag = (languageCode: string): string => {
  const flagMap: Record<string, string> = {
    // English variants
    en: '🇺🇸', // US flag for English
    'en-US': '🇺🇸',
    'en-GB': '🇬🇧',
    'en-CA': '🇨🇦',
    'en-AU': '🇦🇺',

    // Spanish variants
    es: '🇪🇸', // Spain flag for Spanish
    'es-ES': '🇪🇸',
    'es-MX': '🇲🇽',
    'es-AR': '🇦🇷',
    'es-CO': '🇨🇴',

    // French variants
    fr: '🇫🇷', // France flag for French
    'fr-FR': '🇫🇷',
    'fr-CA': '🇨🇦',
    'fr-BE': '🇧🇪',
    'fr-CH': '🇨🇭',

    // German variants
    de: '🇩🇪', // Germany flag for German
    'de-DE': '🇩🇪',
    'de-AT': '🇦🇹',
    'de-CH': '🇨🇭',

    // Italian
    it: '🇮🇹',
    'it-IT': '🇮🇹',

    // Portuguese
    pt: '🇵🇹', // Portugal flag for Portuguese
    'pt-PT': '🇵🇹',
    'pt-BR': '🇧🇷',

    // Dutch
    nl: '🇳🇱',
    'nl-NL': '🇳🇱',
    'nl-BE': '🇧🇪',

    // Russian
    ru: '🇷🇺',
    'ru-RU': '🇷🇺',

    // Chinese variants
    zh: '🇨🇳', // China flag for Chinese
    'zh-CN': '🇨🇳',
    'zh-TW': '🇹🇼',
    'zh-HK': '🇭🇰',

    // Japanese
    ja: '🇯🇵',
    'ja-JP': '🇯🇵',

    // Korean
    ko: '🇰🇷',
    'ko-KR': '🇰🇷',

    // Arabic
    ar: '🇸🇦', // Saudi Arabia flag for Arabic
    'ar-SA': '🇸🇦',
    'ar-EG': '🇪🇬',
    'ar-AE': '🇦🇪',

    // Hindi
    hi: '🇮🇳',
    'hi-IN': '🇮🇳',

    // Turkish
    tr: '🇹🇷',
    'tr-TR': '🇹🇷',

    // Polish
    pl: '🇵🇱',
    'pl-PL': '🇵🇱',

    // Swedish
    sv: '🇸🇪',
    'sv-SE': '🇸🇪',

    // Norwegian
    no: '🇳🇴',
    'no-NO': '🇳🇴',

    // Danish
    da: '🇩🇰',
    'da-DK': '🇩🇰',

    // Finnish
    fi: '🇫🇮',
    'fi-FI': '🇫🇮',

    // Greek
    el: '🇬🇷',
    'el-GR': '🇬🇷',

    // Hebrew
    he: '🇮🇱',
    'he-IL': '🇮🇱',

    // Thai
    th: '🇹🇭',
    'th-TH': '🇹🇭',

    // Vietnamese
    vi: '🇻🇳',
    'vi-VN': '🇻🇳',

    // Indonesian
    id: '🇮🇩',
    'id-ID': '🇮🇩',

    // Malay
    ms: '🇲🇾',
    'ms-MY': '🇲🇾',

    // Filipino
    tl: '🇵🇭',
    'tl-PH': '🇵🇭',

    // Ukrainian
    uk: '🇺🇦',
    'uk-UA': '🇺🇦',

    // Czech
    cs: '🇨🇿',
    'cs-CZ': '🇨🇿',

    // Hungarian
    hu: '🇭🇺',
    'hu-HU': '🇭🇺',

    // Romanian
    ro: '🇷🇴',
    'ro-RO': '🇷🇴',

    // Bulgarian
    bg: '🇧🇬',
    'bg-BG': '🇧🇬',

    // Croatian
    hr: '🇭🇷',
    'hr-HR': '🇭🇷',

    // Serbian
    sr: '🇷🇸',
    'sr-RS': '🇷🇸',

    // Slovak
    sk: '🇸🇰',
    'sk-SK': '🇸🇰',

    // Slovenian
    sl: '🇸🇮',
    'sl-SI': '🇸🇮',

    // Estonian
    et: '🇪🇪',
    'et-EE': '🇪🇪',

    // Latvian
    lv: '🇱🇻',
    'lv-LV': '🇱🇻',

    // Lithuanian
    lt: '🇱🇹',
    'lt-LT': '🇱🇹',
  };

  // Return the flag for the language code, or a default globe emoji if not found
  return flagMap[languageCode.toLowerCase()] || '🌐';
};

// Get language display name with flag
export const getLanguageDisplay = (
  languageCode: string,
  languageName?: string
): string => {
  const flag = getLanguageFlag(languageCode);
  return languageName
    ? `${flag} ${languageName}`
    : `${flag} ${languageCode.toUpperCase()}`;
};
