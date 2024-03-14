const extractUUIDFromCreatedMessage = (message) => {
  const regex = /\[ ([a-f0-9-]+)\ ]/;
  const match = message.match(regex);
  return match ? match[1] : null;
};

const extractUUIDFromUrl = (url) => {
  const regex = /\/payment-requests\/([a-f0-9-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const extractInstitutionFromSubmitMessage = (message) => {
  const regex = /institution id \[([a-z0-9-]+)\]/;
  const match = message.match(regex);
  return match ? match[1] : null;
};

export const PAYMENT_STEPS = {
  CREATED: "created",
  INSTITUTION_SUBMITTED: "institution_submitted",
  AUTHORISATION_INITIATED: "authorisation_initiated",
  AUTHORISATION_UPDATED: "authorisation_updated",
  PAYMENT_EXECUTED: "payment_executed",
};

export const PAYMENT_FLOWS = {
  UNKNOWN: "unknown",
  EMBEDDED: "embedded",
  REDIRECT: "redirect",
};

export const readPayments = (logs) => {
  const payments = logs
    .filter((log) => log.path === "/hosted/payment-requests")
    .reduce((payments, { message }) => {
      const uuid = extractUUIDFromCreatedMessage(message);
      if (uuid) {
        payments.set(uuid, {
          uuid,
          steps: [PAYMENT_STEPS.CREATED],
          flow: "unknown",
        });
      }
      return payments;
    }, new Map());

  logs
    .filter((log) => log.path.includes("submit-institution"))
    .forEach((log) => {
      const uuid = extractUUIDFromUrl(log.path);
      const institution = extractInstitutionFromSubmitMessage(log.message);
      const isEmbedded = log.message.includes("embedded-payment-auth-requests");
      const payment = payments.get(uuid);
      if (payment) {
        payment.steps.push(PAYMENT_STEPS.INSTITUTION_SUBMITTED);
        payment.flow = isEmbedded
          ? PAYMENT_FLOWS.EMBEDDED
          : PAYMENT_FLOWS.REDIRECT;
        payment.institution = institution;
      }
    });

  const addSteps = (path, step) =>
    logs
      .filter((log) => log.path.includes(path))
      .map((log) => extractUUIDFromUrl(log.path))
      .forEach((uuid) => {
        payments.get(uuid)?.steps.push(step);
      });

  [
    ["authorise", PAYMENT_STEPS.AUTHORISATION_INITIATED],
    ["data", PAYMENT_STEPS.AUTHORISATION_UPDATED],
    ["execute", PAYMENT_STEPS.PAYMENT_EXECUTED],
  ].forEach(([path, step]) => addSteps(path, step));

  return [...payments.values()];
};

export const institutionsCounts = (payments) =>
  [
    ...payments
      .filter(({ institution }) => institution)
      .reduce((institutions, payment) => {
        const institutionCounts = institutions.get(payment.institution) || {
          id: payment.institution,
          total: 0,
          completed: 0,
        };
        institutionCounts.total++;
        if (
          payment.steps.includes(PAYMENT_STEPS.PAYMENT_EXECUTED) ||
          (payment.flow === PAYMENT_FLOWS.EMBEDDED &&
            payment.steps.includes(PAYMENT_STEPS.AUTHORISATION_UPDATED))
        ) {
          institutionCounts.completed++;
        }
        institutions.set(payment.institution, institutionCounts);
        return institutions;
      }, new Map())
      .values(),
  ].sort((a, b) => b.total - a.total);
