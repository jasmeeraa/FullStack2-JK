import { platformRules } from '../data/platformRules.js';

export function validateCharacterLimit(platformKey, content) {
  const rule = platformRules[platformKey];
  if (!rule) return { status: 'unknown', message: 'Unknown platform' };

  const length = content.trim().length;
  if (length > rule.limit) {
    return {
      status: 'error',
      message: `Exceeded ${rule.label} limit by ${length - rule.limit} characters`,
    };
  }
  if (length >= rule.warning) {
    return {
      status: 'warning',
      message: `${rule.label} approaching ${rule.limit} character limit`,
    };
  }
  return {
    status: 'ready',
    message: `${rule.label} is within the allowed limit`,
  };
}

export function validateMedia(platformKey, mediaFile) {
  const rule = platformRules[platformKey];
  if (!rule) return { status: 'unknown', message: 'Unknown platform' };

  if (rule.imageRequired) {
    if (!mediaFile) {
      return {
        status: 'error',
        message: 'Instagram requires at least one image',
      };
    }
    if (!mediaFile.type.startsWith('image/')) {
      return {
        status: 'error',
        message: 'Instagram requires an image file',
      };
    }
  }

  return {
    status: 'ready',
    message: `${rule.label} media requirements are satisfied`,
  };
}

export function getValidationStatus(platformKey, content, mediaFile) {
  const textValidation = validateCharacterLimit(platformKey, content);
  const mediaValidation = validateMedia(platformKey, mediaFile);

  if (textValidation.status === 'error' || mediaValidation.status === 'error') {
    return {
      platform: platformKey,
      status: 'error',
      message: textValidation.status === 'error' ? textValidation.message : mediaValidation.message,
    };
  }
  if (textValidation.status === 'warning') {
    return {
      platform: platformKey,
      status: 'warning',
      message: textValidation.message,
    };
  }
  return {
    platform: platformKey,
    status: 'ready',
    message: mediaValidation.status === 'ready' ? `Ready for ${platformRules[platformKey].label}` : mediaValidation.message,
  };
}

export function getRemainingCharacters(platformKey, content) {
  const rule = platformRules[platformKey];
  if (!rule) return 0;
  return rule.limit - content.trim().length;
}
