function getLastNDays(n) {
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);
  endDate.setDate(endDate.getDate());

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - n);

  return {
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  };
}

export const createLogsQuery = (applicationId, lastNDays) => {
  const { start, end } = getLastNDays(lastNDays);
  const filename = `logs-${applicationId}-${start}-${end}.json`;
  const appIdQuery = applicationId
    ? `AND jsonPayload.applicationId="${applicationId}"`
    : "";
  const cmd = `gcloud logging read 'resource.labels.container_name="hosted-auth-service" ${appIdQuery} AND ((jsonPayload.path="/hosted/payment-requests" AND jsonPayload.message:"Created payment request") OR (jsonPayload.path:"/submit-institution" AND jsonPayload.message:"Validate request with institution id") OR (jsonPayload.path:"/authorise" AND jsonPayload.message:"Found hosted payment request for Id") OR (jsonPayload.path:"/data" AND jsonPayload.message:"Found hosted payment request for Id") OR (jsonPayload.path:"/execute" AND jsonPayload.message:"Found hosted payment request for Id")) AND timestamp>="${start}" AND timestamp<"${end}"' --format=json | jq '[.[] | {path: .jsonPayload.path, message: .jsonPayload.message}]' > ${filename}`;
  return [cmd, { start, end }, filename];
};

export const createErrorLogsUrl = (applicationId, lastNDays) => {
  let query =
    'resource.labels.container_name="hosted-auth-service" AND severity="ERROR"';

  if (applicationId) {
    query += " AND jsonPayload.applicationId=" + applicationId;
  }

  const { start, end } = getLastNDays(lastNDays);
  query += ` AND timestamp>="${start}" AND timestamp<"${end}"`;

  return `https://console.cloud.google.com/logs/query;query=${encodeURIComponent(
    query
  )}?project=yapily-logs-info`;
};
