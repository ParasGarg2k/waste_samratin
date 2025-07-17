"use client";

import { useEffect, useState } from "react";

const dummyData = [
  {
    rfid: "RFID001",
    timestamp: new Date().toISOString(),
    dry_waste: 3.2,
    wet_waste: 1.5,
    recyclable_waste: 0.7,
    non_segregated_waste: 0.1,
    dry_waste_details: { rating: 4 },
    wet_waste_details: { rating: 3 },
    red_waste_details: { rating: 2 },
  },
  {
    rfid: "RFID002",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    dry_waste: 2.0,
    wet_waste: 2.3,
    recyclable_waste: 1.1,
    non_segregated_waste: 0.2,
    dry_waste_details: { rating: 5 },
    wet_waste_details: { rating: 4 },
    red_waste_details: { rating: 3 },
  },
  {
    rfid: "RFID003",
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    dry_waste: 4.1,
    wet_waste: 1.8,
    recyclable_waste: 1.5,
    non_segregated_waste: 0,
    dry_waste_details: { rating: 3 },
    wet_waste_details: { rating: 2 },
    red_waste_details: { rating: 1 },
  },
];

export default function WasteDataTable() {
  const [wasteData, setWasteData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/logs")
      .then((res) => res.json())
      .then((data) => {
        console.log("logs data:", data);
        if (Array.isArray(data) && data.length > 0) {
          setWasteData(data);
        } else {
          setWasteData(dummyData);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch logs data:", err);
        // Use dummy data on error
        setWasteData(dummyData);
      });
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        📋 Collected Waste Summary
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-green-200 dark:bg-green-900 sticky top-0 z-10">
            <tr>
              {[
                "RFID",
                "Timestamp",
                "Dry (kg)",
                "Wet (kg)",
                "Recyclable (kg)",
                "Non-Segregated (kg)",
                "Dry Rating",
                "Wet Rating",
                "Red Rating",
              ].map((title) => (
                <th
                  key={title}
                  className="px-5 py-3 font-semibold text-gray-800 dark:text-gray-100 tracking-wide"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {wasteData.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-4 text-center text-gray-400 dark:text-gray-500"
                >
                  No data found.
                </td>
              </tr>
            ) : (
              wasteData.map((entry, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors duration-150 ${
                    idx % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-900"
                  } hover:bg-green-50 dark:hover:bg-green-800/30`}
                >
                  <td className="px-5 py-3">{entry.rfid}</td>
                  <td className="px-5 py-3">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">{entry.dry_waste}</td>
                  <td className="px-5 py-3">{entry.wet_waste}</td>
                  <td className="px-5 py-3">{entry.recyclable_waste}</td>
                  <td className="px-5 py-3">{entry.non_segregated_waste}</td>
                  <td className="px-5 py-3">
                    {entry.dry_waste_details?.rating ?? "-"}
                  </td>
                  <td className="px-5 py-3">
                    {entry.wet_waste_details?.rating ?? "-"}
                  </td>
                  <td className="px-5 py-3">
                    {entry.red_waste_details?.rating ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
