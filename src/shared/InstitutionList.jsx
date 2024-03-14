export const InstitutionList = ({
  institutions,
  selectedInstitution,
  onInstitutionSelected,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {selectedInstitution ? (
        <div
          className="px-2 py-1 cursor-pointer text-gray-500"
          onClick={() => onInstitutionSelected(null)}
        >
          Clear filter
        </div>
      ) : (
        <div className="px-2 py-1 text-gray-500">Select bank to filter by</div>
      )}
      <ul>
        {institutions.map(({ id, total, completed }) => (
          <li
            key={id}
            className="flex flex-col border px-2 py-1 cursor-pointer rounded-md hover:bg-green-50 mt-2"
            onClick={() => onInstitutionSelected(id)}
          >
            {id}: {total} ({Math.floor((completed / total) * 100)}%)
          </li>
        ))}
      </ul>
    </div>
  );
};
