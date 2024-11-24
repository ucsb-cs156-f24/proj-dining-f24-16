
import { toast } from "react-toastify";

// Stryker disable all : dev facing debug functions, no need to test

export function onDeleteSuccess(response) {
  console.log(response);
  toast("Review deleted successfully");
}

export function onApproveSuccess(response) {
  console.log(response);
  toast("Review approved successfully");
}

export function onRejectSuccess(response) {
  console.log(response);
  toast("Review rejected successfully");
}

// Stryker restore all

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/review",
    method: "DELETE",
    params: {
      id: cell.row.values.id,
    },
  };
}

export function cellToAxiosParamsApprove(cell) {
  return {
    url: `/api/review/approve/${cell.row.values.id}`,
    method: "POST",
  };
}

export function cellToAxiosParamsReject(cell) {
  return {
    url: `/api/review/reject/${cell.row.values.id}`,
    method: "POST",
  };
}
