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

export const computePIS = (logs) => {
  console.log(logs);
  const payments = logs
    .filter((log) => log.path === "/hosted/payment-requests")
    .reduce((payments, { message }) => {
      const uuid = extractUUIDFromCreatedMessage(message);
      if (uuid) {
        payments.set(uuid, { uuid, steps: ["created"] });
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
        payment.steps.push("institution_submitted");
        payment.isEmbedded = isEmbedded;
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
    ["authorise", "authorisation_initiated"],
    ["data", "authorisation_updated"],
    ["execute", "payment_executed"],
  ].forEach(([path, step]) => addSteps(path, step));

  console.log(payments);

  return [...payments.values()];
};
