// frontend/src/main/components/Review/ReviewTable.js

import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
  cellToAxiosParamsApprove,
  onApproveSuccess,
  cellToAxiosParamsReject,
  onRejectSuccess,
} from "main/utils/ReviewUtils";
import { useNavigate } from "react-router-dom";

export default function ReviewTable({
  reviews,
  // Removed currentUser as it's not used
  moderatorOptions = false,
  deleteColumn = false,
}) {
  const navigate = useNavigate();

  // Removed editCallback as it's not used

  // Stryker disable all: hard to test for query caching

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/review/all"]
  );

  const approveMutation = useBackendMutation(
    cellToAxiosParamsApprove,
    { onSuccess: onApproveSuccess },
    ["/api/review/all"]
  );

  const rejectMutation = useBackendMutation(
    cellToAxiosParamsReject,
    { onSuccess: onRejectSuccess },
    ["/api/review/all"]
  );

  // Stryker restore all

  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const approveCallback = async (cell) => {
    approveMutation.mutate(cell);
  };

  const rejectCallback = async (cell) => {
    rejectMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "Id",
      accessor: "id",
    },
    {
      Header: "Student ID",
      accessor: "studentId",
    },
    {
      Header: "Item ID",
      accessor: "itemId",
    },
    {
      Header: "Date Item Served",
      accessor: "dateItemServed",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Moderator ID",
      accessor: "userIdModerator",
    },
    {
      Header: "Moderator Comments",
      accessor: "moderatorComments",
    },
    {
      Header: "Date Created",
      accessor: "dateCreated",
    },
    {
      Header: "Date Edited",
      accessor: "dateEdited",
    },
  ];

  if (moderatorOptions) {
    columns.push(
      ButtonColumn("Approve", "success", approveCallback, "ReviewTable")
    );
    columns.push(
      ButtonColumn("Reject", "warning", rejectCallback, "ReviewTable")
    );
  }

  if (deleteColumn) {
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, "ReviewTable")
    );
  }

  return <OurTable data={reviews} columns={columns} testid={"ReviewTable"} />;
}
