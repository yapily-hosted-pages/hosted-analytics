const Filter = ({ children, label }) => (
  <div className="flex flex-col gap-1">
    <label className="text-gray-500">{label}</label>
    {children}
  </div>
);

export const Filters = ({
  product,
  onProductChanged,
  applicationId,
  onApplicationIdChanged,
  days,
  onDaysChanged,
}) => {
  return (
    <div className="flex flex-row gap-3">
      <Filter label="Product">
        <select
          className="border py-1 px-2 rounded-md"
          value={product}
          onChange={(e) => onProductChanged(e.target.value)}
        >
          <option value="payments">Payments</option>
          <option value="consents">Consents</option>
        </select>
      </Filter>
      <Filter label={"Time Filter Date"}>
        <select
          className="border py-1 px-2 rounded-md"
          value={days}
          onChange={(e) => onDaysChanged(e.target.value)}
        >
          <option value={1}>Yesterday</option>
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </Filter>
      <Filter label="Application ID (Optional)">
        <input
          className="border py-1 px-2 rounded-md"
          type="text"
          value={applicationId}
          onChange={(e) => onApplicationIdChanged(e.target.value)}
        />
      </Filter>
    </div>
  );
};
