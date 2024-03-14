import { useState } from "react";
import { daysToRange } from "../lib/dates";
import gcp from "../lib/gcp";
import { Filters } from "./Filters";
import { Instructions } from "./Instructions";
import { JsonDrop } from "./JsonDrop";

export const Welcome = ({ onLogsLoaded }) => {
  const [product, setProduct] = useState("payments");
  const [applicationId, setApplicationId] = useState("");
  const [days, setDays] = useState(7);
  const [logs, setLogs] = useState(null);

  const { start, end } = daysToRange(days);

  const { cmd, filename } = gcp[product].readLogs(applicationId, start, end);

  if (logs) {
    onLogsLoaded({ logs, product, applicationId, start, end });
  }

  return (
    <div className="flex flex-col gap-8 items-center h-screen w-screen">
      <h1 className="text-5xl text-center mt-10 mb-6 text-green-800">
        Hosted Analytics
      </h1>
      <Filters
        product={product}
        onProductChanged={setProduct}
        applicationId={applicationId}
        onApplicationIdChanged={setApplicationId}
        days={days}
        onDaysChanged={setDays}
      />
      <Instructions readLogsCmd={cmd} filename={filename} />
      <JsonDrop
        label="Drag and drop the logs here to see the funnel and bank distribution"
        onDropped={setLogs}
      />
    </div>
  );
};
