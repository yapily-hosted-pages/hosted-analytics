export const CONSENT_STEPS = {
  CREATED: "created",
  INSTITUTION_SUBMITTED: "institution_submitted",
  AUTHORISATION_INITIATED: "authorisation_initiated",
  AUTHORISATION_UPDATED: "authorisation_updated",
  CONSENT_EXECUTED: "consent_executed",
};

export const CONSENT_FLOWS = {
  UNKNOWN: "unknown",
  EMBEDDED: "embedded",
  REDIRECT: "redirect",
};

const extractUUID = (url) => {
  const regex = /\/ais\/consent-requests\/([a-f0-9-]+)\//;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const extractInstitutionId = (message) => {
  const regex = /\[(.*?)\]/;
  const match = message.match(regex);
  return match ? match[1] : null;
};

export const readConsents = (logs) => {
  const consentsCreatedCount = logs.filter(
    (log) =>
      log.path === "/hosted/consent-requests" &&
      log.message.includes("[Create consent]")
  ).length;

  const consents = logs
    .filter(
      (log) =>
        log.path.includes("submit-institution") &&
        log.message.includes("Validate request with institution id")
    )
    .reduce((institutionsSubmitted, log) => {
      const uuid = extractUUID(log.path);

      institutionsSubmitted.set(uuid, {
        uuid,
        institution: extractInstitutionId(log.message),
        flow: log.message.includes("embedded")
          ? CONSENT_FLOWS.EMBEDDED
          : CONSENT_FLOWS.REDIRECT,
        steps: [CONSENT_STEPS.CREATED, CONSENT_STEPS.INSTITUTION_SUBMITTED],
      });

      return institutionsSubmitted;
    }, new Map());

  for (let i = 0; i < consentsCreatedCount - consents.size; i++) {
    const uuid = `unknown-${i}`;
    consents.set(uuid, {
      uuid,
      institution: "unknown",
      flow: CONSENT_FLOWS.UNKNOWN,
      steps: [CONSENT_STEPS.CREATED],
    });
  }

  const addSteps = (path, step) =>
    logs
      .filter((log) => log.path.includes(path))
      .map((log) => extractUUID(log.path))
      .forEach((uuid) => {
        consents.get(uuid)?.steps.push(step);
      });

  [
    ["authorise", CONSENT_STEPS.AUTHORISATION_INITIATED],
    ["data", CONSENT_STEPS.AUTHORISATION_UPDATED],
    ["execute", CONSENT_STEPS.CONSENT_EXECUTED],
  ].forEach(([path, step]) => addSteps(path, step));

  return [...consents.values()];
};
