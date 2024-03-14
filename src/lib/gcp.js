export default {
  payments: {
    readLogs: (applicationId, start, end) => {
      const filename = `logs-${
        applicationId || "all"
      }-payments-${start}-${end}.json`;

      const applicationQuery = applicationId
        ? `AND jsonPayload.applicationId="${applicationId}"`
        : "";

      const cmd = `gcloud logging read 'resource.labels.container_name="hosted-auth-service" ${applicationQuery} AND ((jsonPayload.path="/hosted/payment-requests" AND jsonPayload.message:"Created payment request") OR (jsonPayload.path:"/submit-institution" AND jsonPayload.message:"Validate request with institution id") OR (jsonPayload.path:"/authorise" AND jsonPayload.message:"Found hosted payment request for Id") OR (jsonPayload.path:"/data" AND jsonPayload.message:"Found hosted payment request for Id") OR (jsonPayload.path:"/execute" AND jsonPayload.message:"Found hosted payment request for Id")) AND timestamp>="${start}" AND timestamp<"${end}"' --format=json | jq '[.[] | {path: .jsonPayload.path, message: .jsonPayload.message}]' > ${filename}`;

      return {
        cmd,
        filename,
      };
    },
    errorsUrl: (applicationId, start, end) => {
      let query = `resource.labels.container_name="hosted-auth-service" AND severity="ERROR" AND timestamp>="${start}" AND timestamp<"${end}"`;

      if (applicationId) {
        query += ` AND jsonPayload.applicationId="${applicationId}"`;
      }

      return `https://console.cloud.google.com/logs/query;query=${encodeURIComponent(
        query
      )}?project=yapily-logs-info`;
    },
  },
  consents: {
    readLogs: (applicationId, start, end) => {
      const filename = `logs-${
        applicationId || "all"
      }-consents-${start}-${end}.json`;

      const applicationQuery = applicationId
        ? `AND jsonPayload.applicationId="${applicationId}"`
        : "";

      const cmd = `gcloud logging read 'resource.labels.container_name="hosted-consent-service" AND ((jsonPayload.path="/hosted/consent-requests" AND jsonPayload.message:"[Create consent]") OR (jsonPayload.path:"submit-institution" AND jsonPayload.message:"Validate request with institution id") OR (jsonPayload.path:"authorise" AND jsonPayload.message:"Found hosted consent request for ID") OR (jsonPayload.path:"data" AND jsonPayload.message:"Found hosted consent request for ID") OR (jsonPayload.path:"execute" AND jsonPayload.message:"Found hosted consent request for ID")) ${applicationQuery} AND timestamp>="${start}" AND timestamp<"${end}"' --format=json | jq '[.[] | {path: .jsonPayload.path, message: .jsonPayload.message}]' > ${filename}`;

      return {
        cmd,
        filename,
      };
    },
    errorsUrl: (applicationId, start, end) => {
      let query = `resource.labels.container_name="hosted-consent-service" AND severity="ERROR" AND timestamp>="${start}" AND timestamp<"${end}"`;

      if (applicationId) {
        query += ` AND jsonPayload.applicationId="${applicationId}"`;
      }

      return `https://console.cloud.google.com/logs/query;query=${encodeURIComponent(
        query
      )}?project=yapily-logs-info`;
    },
  },
};
