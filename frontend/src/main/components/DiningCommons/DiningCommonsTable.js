import React from "react";
import OurTable from "main/components/OurTable";

export default function DiningCommonsTable({ commons }) {
  const columns = [
    {
      Header: "Code",
      accessor: "code", // accessor is the "key" in the data
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Has Dining Cam",
      accessor: "hasDiningCam",
      // Credits to Jayden for the code here!
      // Renders a checkmark box for whether or not the help request has been solved.
      Cell: ({ value }) => (value ? "✅" : "❌"),
    },
    {
      Header: "Has Sack Meal",
      accessor: "hasSackMeal",
      // Credits to Jayden for the code here!
      // Renders a checkmark box for whether or not the help request has been solved.
      Cell: ({ value }) => (value ? "✅" : "❌"),
    },
    { 
      Header: "Has Takeout Meal",
      accessor: "hasTakeOutMeal",
      // Credits to Jayden for the code here!
      // Renders a checkmark box for whether or not the help request has been solved.
      Cell: ({ value }) => (value ? "✅" : "❌"),
    },
    { 
    Header: "Latitude",
    accessor: "latitude",
    },
    { 
    Header: "Longitude",
    accessor: "longitude",
    }
  ];

  const testid = "DiningCommonsTable";

  const displayedColumns = columns;

  return <OurTable data={commons} columns={displayedColumns} testid={testid} />;
}
