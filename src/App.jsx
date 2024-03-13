import { useState } from "react";
import JsonDropzone from "./JsonDropZone";
import { computePIS } from "./lib/compute";
import { FunnelPIS } from "./FunnelPIS";
import lookerScreenshot from "./assets/looker.png";
import { createLookerUrl } from "./lib/looker";
import { createLogsQuery } from "./lib/logs";

function App() {
  const [payments, setPayments] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [lastNDays, setLastNDays] = useState(7);
  const [applicationId, setApplicationId] = useState(null);

  const onJsonDropped = (json) => {
    setPayments(computePIS(json));
  };

  const bankCounts = [
    ...payments
      .filter(({ institution }) => institution)
      .reduce((banks, payment) => {
        const bank = banks.get(payment.institution) || {
          id: payment.institution,
          total: 0,
          completed: 0,
        };
        bank.total++;
        if (
          payment.steps.includes("payment_executed") ||
          (payment.isEmbedded &&
            payment.steps.includes("authorisation_updated"))
        ) {
          bank.completed++;
        }
        banks.set(payment.institution, bank);
        return banks;
      }, new Map())
      .values(),
  ].sort((a, b) => b.total - a.total);

  const [cmd, { start, end }, filename] = createLogsQuery(
    applicationId,
    lastNDays
  );

  const filteredPayment = selectedInstitution
    ? payments.filter((p) => p.institution === selectedInstitution)
    : null;

  return payments.length > 0 ? (
    <div className="flex flex-col m-8 gap-8 w-screen items-center">
      <div className="flex flex-col gap-1 border border-green-800 rounded-md py-4 px-8">
        <h1 className="text-2xl text-green-800 mb-3">
          Funnel {selectedInstitution && `(${selectedInstitution})`}
        </h1>
        <FunnelPIS payments={filteredPayment ? filteredPayment : payments} />
      </div>
      <div className="flex flex-row gap-8">
        <div className="flex flex-col flex-grow border border-green-800 rounded-md py-4 px-8">
          <h1 className="text-2xl text-green-800 mb-3">Banks</h1>
          {selectedInstitution ? (
            <div
              className="px-2 py-1 cursor-pointer text-gray-500"
              onClick={() => setSelectedInstitution(null)}
            >
              Clear filter
            </div>
          ) : (
            <div className="px-2 py-1 text-gray-500">Click bank to filter</div>
          )}
          {bankCounts.map(({ id, total, completed }) => (
            <div
              key={id}
              className="flex flex-col border px-2 py-1 cursor-pointer rounded-md hover:bg-gray-50 mt-2"
              onClick={() => setSelectedInstitution(id)}
            >
              {id}: {total} ({Math.floor((completed / total) * 100)}%)
            </div>
          ))}
        </div>
        <div className="flex flex-col border border-green-800 rounded-md pt-4 pb-8 px-8 max-w-2xl h-fit">
          <h1 className="text-2xl text-green-800">Looker</h1>
          <p className="my-3">
            To understand the complete E2E conversion rate, please use the
            following{" "}
            <a
              href={createLookerUrl(
                applicationId,
                start,
                end,
                selectedInstitution
              )}
              target="_blank"
            >
              Looker dashboard
            </a>
            , and divide the total E2E number by the total requests created.
          </p>
          <img src={lookerScreenshot} />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-8 items-center h-screen w-screen">
      <h1 className="text-5xl text-center mt-10 mb-8 text-green-800">
        Hosted Analytics
      </h1>
      <div className="flex flex-row gap-3 w-1/3">
        <div className="flex flex-col gap-1 flex-grow">
          <label className="text-gray-500">Application ID (Optional)</label>
          <input
            className="border py-1 px-2 rounded-md"
            type="text"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-500">Time Filter Date</label>
          <select
            className="border py-1 px-2 rounded-md"
            value={lastNDays}
            onChange={(e) => setLastNDays(e.target.value)}
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>
      </div>
      <ol className="list-decimal">
        <li>
          Go to your{" "}
          <a
            href="https://shell.cloud.google.com/?hl=en_GB&fromcloudshell=true&show=terminal"
            target="_blank"
          >
            Google Cloud Shell
          </a>
        </li>
        <li>
          Make sure your project is set to yaily-logs-info
          <div className="flex flex-row gap-2">
            <div className="max-w-lg whitespace-nowrap overflow-auto bg-gray-100 p-2 rounded-md text-xs text-gray-600">
              gcloud config set project yapily-logs-info
            </div>
            <button
              className="text-xs"
              onClick={() =>
                navigator.clipboard.writeText(
                  "gcloud config set project yapily-logs-info"
                )
              }
            >
              Copy
            </button>
          </div>
        </li>
        <li>
          Run the following command to generate the logs (this can take a while)
          <div className="flex flex-row gap-2">
            <div className="max-w-lg whitespace-nowrap overflow-auto bg-gray-100 p-2 rounded-md text-xs text-gray-600">
              {cmd}
            </div>
            <button
              className="text-xs"
              onClick={() => navigator.clipboard.writeText(cmd)}
            >
              Copy
            </button>
          </div>
        </li>
        <li>
          Download the logs
          <div className="flex flex-row gap-2">
            <div className="max-w-lg whitespace-nowrap overflow-auto bg-gray-100 p-2 rounded-md text-xs text-gray-600">
              cloudshell download {filename}
            </div>
            <button
              className="text-xs"
              onClick={() =>
                navigator.clipboard.writeText(`cloudshell download ${filename}`)
              }
            >
              Copy
            </button>
          </div>
        </li>
      </ol>
      <JsonDropzone onJsonDropped={onJsonDropped} />
    </div>
  );
}

export default App;
