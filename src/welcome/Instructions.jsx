const Instruction = ({ label, cmd }) => (
  <li className="mt-2">
    <p>{label}</p>
    {cmd && (
      <div className="flex flex-row gap-2 mt-1">
        <div className="max-w-lg whitespace-nowrap overflow-auto bg-gray-100 p-2 rounded-md text-sm text-gray-500">
          {cmd}
        </div>
        <button
          className="text-xs"
          onClick={() => navigator.clipboard.writeText(cmd)}
        >
          Copy
        </button>
      </div>
    )}
  </li>
);

export const Instructions = ({ readLogsCmd, filename }) => {
  const setProjectCmd = "gcloud config set project yapily-logs-info";
  const downloadFileCmd = `cloudshell download ${filename}`;

  return (
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
      <Instruction
        label="Make sure your project is set to yaily-logs-info"
        cmd={setProjectCmd}
      />
      <Instruction
        label="Run the following command to generate the logs (this can take a while)"
        cmd={readLogsCmd}
      />
      <Instruction label="Download the logs" cmd={downloadFileCmd} />
    </ol>
  );
};
