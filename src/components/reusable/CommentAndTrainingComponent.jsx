import React, { useState } from "react";

const CommentAndTrainingComponent = ({
  training,
  setTraining,
  trainingDuration,
  setTrainingDuration,
  trainingPriority,
  setTrainingPriority,
  trainingSet,
  addTrainingToGrid,
}) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== "") {
      setMessages([...messages, inputMessage]);
      setInputMessage(""); // Clear the input field after sending the message
    }
  };

  const handlePrint = () => {
    window.print(); // Triggers the print dialog
  };

  return (
    <div>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-4">
        <div className="h-64 overflow-y-scroll border border-gray-300 p-4 rounded-lg">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="my-2">
                <div className="bg-customOrange-300 text-white p-2 rounded-lg max-w-xs">
                  {message}
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSendMessage} className="mt-4 flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message"
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
          />
          <button
            type="submit"
            className="bg-customOrange-300 text-white px-4 py-2 rounded-md"
          >
            Send
          </button>
        </form>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Training</label>
          <textarea
            className="mt-1 block w-full rounded-md border border-gray-300 h-8 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={training}
            onChange={(e) => setTraining(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Duration</label>
          <textarea
            className="mt-1 block w-full rounded-md border border-gray-300 h-8 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={trainingDuration}
            onChange={(e) => setTrainingDuration(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border border-gray-300 h-8 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={trainingPriority}
            onChange={(e) => setTrainingPriority(e.target.value)}
          />
        </div>

        <div className="text-right mb-4">
          <button
            className="bg-customOrange-300 text-white px-4 py-2 rounded-md mr-2"
            onClick={() => {
              setTraining("");
              setTrainingDuration("");
              setTrainingPriority("");
            }}
          >
            Clear
          </button>
          <button
            className="bg-customOrange-300 text-white px-4 py-2 rounded-md"
            onClick={addTrainingToGrid}
          >
            Add to Grid
          </button>
        </div>

        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 rounded-md overflow-hidden dark:border-gray-700 shadow-md">
  <thead className="bg-gray-200 dark:bg-gray-800">
    <tr>
      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 dark:text-gray-300 uppercase tracking-wider font-semibold">Training</th>
      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Start Date</th>
      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">End Date</th>
    </tr>
  </thead>
  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
    {trainingSet.length === 0 ? (
      <tr>
        <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
          No training data available.
        </td>
      </tr>
    ) : (
      trainingSet.map((item, index) => (
        <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-800">
          <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900 dark:text-gray-300 font-semibold">{item.compliance}</td>
          <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-300">{item.details}</td>
          <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-300">{item.expectedPercentage}</td>
          <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-300">{item.startDate}</td>
          <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-300">{item.endDate}</td>
        </tr>
      ))
    )}
  </tbody>
</table>

        </div>

        <div className="text-right mt-4">
          <button
            className="bg-customOrange-300 text-white px-4 py-2 rounded-md"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentAndTrainingComponent;
