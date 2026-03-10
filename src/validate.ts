import { StampFile } from './batch';

const MAX_PROJECT_LENGTH = 100;
const MAX_SUBJECT_LENGTH = 200;
const MAX_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;
const BATCH_ID_REGEX = /^(0x)?[0-9a-fA-F]{64}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationError = {
  field: string;
  message: string;
};

export function validateStampFile(
  data: unknown,
): { valid: true; data: StampFile } | { valid: false; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { valid: false, errors: [{ field: 'root', message: 'Must be a JSON object' }] };
  }

  const obj = data as Record<string, unknown>;

  // project
  if (typeof obj.project !== 'string' || obj.project.trim().length === 0) {
    errors.push({ field: 'project', message: 'Required non-empty string' });
  } else if (obj.project.length > MAX_PROJECT_LENGTH) {
    errors.push({ field: 'project', message: `Must be at most ${MAX_PROJECT_LENGTH} characters` });
  }

  // subject
  if (typeof obj.subject !== 'string' || obj.subject.trim().length === 0) {
    errors.push({ field: 'subject', message: 'Required non-empty string' });
  } else if (obj.subject.length > MAX_SUBJECT_LENGTH) {
    errors.push({ field: 'subject', message: `Must be at most ${MAX_SUBJECT_LENGTH} characters` });
  }

  // maintainerAddress (email)
  if (typeof obj.maintainerAddress !== 'string' || obj.maintainerAddress.trim().length === 0) {
    errors.push({ field: 'maintainerAddress', message: 'Required non-empty string' });
  } else if (!EMAIL_REGEX.test(obj.maintainerAddress)) {
    errors.push({ field: 'maintainerAddress', message: 'Must be a valid email address' });
  }

  // stamps array
  if (!Array.isArray(obj.stamps)) {
    errors.push({ field: 'stamps', message: 'Must be an array' });
  } else if (obj.stamps.length === 0) {
    errors.push({ field: 'stamps', message: 'Must contain at least one stamp' });
  } else {
    for (let i = 0; i < obj.stamps.length; i++) {
      const stamp = obj.stamps[i];
      const prefix = `stamps[${i}]`;

      if (typeof stamp !== 'object' || stamp === null || Array.isArray(stamp)) {
        errors.push({ field: prefix, message: 'Must be an object' });
        continue;
      }

      // name
      if (typeof stamp.name !== 'string' || stamp.name.trim().length === 0) {
        errors.push({ field: `${prefix}.name`, message: 'Required non-empty string' });
      } else if (stamp.name.length > MAX_NAME_LENGTH) {
        errors.push({ field: `${prefix}.name`, message: `Must be at most ${MAX_NAME_LENGTH} characters` });
      }

      // description
      if (typeof stamp.description !== 'string' || stamp.description.trim().length === 0) {
        errors.push({ field: `${prefix}.description`, message: 'Required non-empty string' });
      } else if (stamp.description.length > MAX_DESCRIPTION_LENGTH) {
        errors.push({
          field: `${prefix}.description`,
          message: `Must be at most ${MAX_DESCRIPTION_LENGTH} characters`,
        });
      }

      // batchId
      if (typeof stamp.batchId !== 'string' || stamp.batchId.trim().length === 0) {
        errors.push({ field: `${prefix}.batchId`, message: 'Required non-empty string' });
      } else if (!BATCH_ID_REGEX.test(stamp.batchId)) {
        errors.push({
          field: `${prefix}.batchId`,
          message: 'Must be a 64-character hex string (with or without 0x prefix)',
        });
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: obj as unknown as StampFile };
}

export function logValidationErrors(fileName: string, errors: ValidationError[]): void {
  console.error(`Validation failed for ${fileName}:`);
  for (const err of errors) {
    console.error(`  - ${err.field}: ${err.message}`);
  }
}
