import { useState } from "react";
import { Welcome } from "./welcome/Welcome";
import { PaymentsDashboard } from "./payments/PaymentsDashboard";
import { ConsentsDashboard } from "./consents/ConsentsDashboard";
import { readPayments } from "./lib/payments";
import { readConsents } from "./lib/consents";

const Dashboard = ({ logs, product, applicationId, start, end }) => {
  if (product === "payments") {
    return (
      <PaymentsDashboard
        payments={readPayments(logs)}
        {...{ applicationId, start, end }}
      />
    );
  } else {
    return (
      <ConsentsDashboard
        consents={readConsents(logs)}
        {...{ applicationId, start, end }}
      />
    );
  }
};

export default function App() {
  const [dashboardData, setDashboardData] = useState(null);

  return dashboardData ? (
    <Dashboard {...dashboardData} />
  ) : (
    <Welcome onLogsLoaded={setDashboardData} />
  );
}
