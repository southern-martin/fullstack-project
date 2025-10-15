// Chart data for TailAdmin dashboard

export const monthlySalesData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Sales",
      data: [12, 19, 3, 5, 2, 3, 20, 3, 5, 6, 2, 3],
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    },
  ],
};

export const revenueTrendData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Revenue",
      data: [65, 59, 80, 81, 56, 55, 40, 30, 45, 50, 70, 85],
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      borderColor: "rgba(34, 197, 94, 1)",
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    },
  ],
};

export const customerDemographicsData = {
  labels: ["USA", "France", "Germany", "UK", "Canada"],
  datasets: [
    {
      label: "Customers",
      data: [79, 23, 15, 8, 5],
      backgroundColor: [
        "rgba(59, 130, 246, 0.8)",
        "rgba(34, 197, 94, 0.8)",
        "rgba(251, 191, 36, 0.8)",
        "rgba(239, 68, 68, 0.8)",
        "rgba(139, 92, 246, 0.8)",
      ],
      borderColor: [
        "rgba(59, 130, 246, 1)",
        "rgba(34, 197, 94, 1)",
        "rgba(251, 191, 36, 1)",
        "rgba(239, 68, 68, 1)",
        "rgba(139, 92, 246, 1)",
      ],
      borderWidth: 2,
    },
  ],
};
