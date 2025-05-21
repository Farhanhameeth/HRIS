const DataTable = ({ columns, data, onRowClick }) => {
  // 🔍 Debug logs
  console.log(" DataTable received props:");
  console.log(" Columns:", columns);
  console.log(" Data:", data);
  console.log(" onRowClick exists:", typeof onRowClick === 'function');

  return (
    <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {data && data.length > 0 ? (
          data.map((row, rowIndex) => {
            console.log(`📌 Rendering row ${rowIndex}:`, row);

            return (
              <tr
                key={row.id || rowIndex}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  console.log("👉 Row clicked:", row);
                  onRowClick?.(row);
                }}
              >
                {columns.map((column, colIndex) => {
                  const cellValue = column.render
                    ? column.render(row)
                    : row[column.accessor];

                  console.log(`🔹 Cell [${rowIndex}, ${colIndex}]:`, cellValue);

                  return (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                    >
                      {cellValue}
                    </td>
                  );
                })}
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={columns.length} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">
              No records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DataTable;
