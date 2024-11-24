// frontend/src/main/components/Review/ReviewTable.test.js

import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { ReviewFixtures } from "fixtures/reviewFixtures";
import ReviewTable from "main/components/Review/ReviewTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ReviewTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReviewTable
            reviews={ReviewFixtures.threeReviews}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedHeaders = [
      "Id",
      "Student ID",
      "Item ID",
      "Date Item Served",
      "Status",
      "Moderator ID",
      "Moderator Comments",
      "Date Created",
      "Date Edited",
    ];
    const expectedFields = [
      "id",
      "studentId",
      "itemId",
      "dateItemServed",
      "status",
      "userIdModerator",
      "moderatorComments",
      "dateCreated",
      "dateEdited",
    ];
    const testId = "ReviewTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByRole('columnheader', { name: headerText });
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const cell = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(cell).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

    // Check that Approve, Reject, and Delete buttons are not present
    const approveButton = screen.queryByTestId(`${testId}-cell-row-0-col-Approve-button`);
    expect(approveButton).not.toBeInTheDocument();

    const rejectButton = screen.queryByTestId(`${testId}-cell-row-0-col-Reject-button`);
    expect(rejectButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).not.toBeInTheDocument();
  });

  test("Has the expected column headers and content with moderator options and delete column", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReviewTable
            reviews={ReviewFixtures.threeReviews}
            currentUser={currentUser}
            moderatorOptions={true}
            deleteColumn={true}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedHeaders = [
      "Id",
      "Student ID",
      "Item ID",
      "Date Item Served",
      "Status",
      "Moderator ID",
      "Moderator Comments",
      "Date Created",
      "Date Edited",
      "Approve",
      "Reject",
      "Delete",
    ];
    const expectedFields = [
      "id",
      "studentId",
      "itemId",
      "dateItemServed",
      "status",
      "userIdModerator",
      "moderatorComments",
      "dateCreated",
      "dateEdited",
    ];
    const testId = "ReviewTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByRole('columnheader', { name: headerText });
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const cell = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(cell).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

    // Check that Approve, Reject, and Delete buttons are present
    const approveButton = screen.getByTestId(`${testId}-cell-row-0-col-Approve-button`);
    expect(approveButton).toBeInTheDocument();
    expect(approveButton).toHaveClass("btn-success");

    const rejectButton = screen.getByTestId(`${testId}-cell-row-0-col-Reject-button`);
    expect(rejectButton).toBeInTheDocument();
    expect(rejectButton).toHaveClass("btn-warning");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Approve button calls approve callback", async () => {
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPost("/api/review/approve/1").reply(200, { message: "Review approved" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReviewTable
            reviews={ReviewFixtures.threeReviews}
            currentUser={currentUser}
            moderatorOptions={true}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId(`ReviewTable-cell-row-0-col-id`)).toHaveTextContent("1");
    });

    const approveButton = screen.getByTestId(`ReviewTable-cell-row-0-col-Approve-button`);
    expect(approveButton).toBeInTheDocument();

    fireEvent.click(approveButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
    expect(axiosMock.history.post[0].url).toBe("/api/review/approve/1");
  });

  test("Reject button calls reject callback", async () => {
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onPost("/api/review/reject/1").reply(200, { message: "Review rejected" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReviewTable
            reviews={ReviewFixtures.threeReviews}
            currentUser={currentUser}
            moderatorOptions={true}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId(`ReviewTable-cell-row-0-col-id`)).toHaveTextContent("1");
    });

    const rejectButton = screen.getByTestId(`ReviewTable-cell-row-0-col-Reject-button`);
    expect(rejectButton).toBeInTheDocument();

    fireEvent.click(rejectButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
    expect(axiosMock.history.post[0].url).toBe("/api/review/reject/1");
  });

  test("Delete button calls delete callback", async () => {
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onDelete("/api/review", { params: { id: 1 } }).reply(200, { message: "Review deleted" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReviewTable
            reviews={ReviewFixtures.threeReviews}
            currentUser={currentUser}
            deleteColumn={true}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId(`ReviewTable-cell-row-0-col-id`)).toHaveTextContent("1");
    });

    const deleteButton = screen.getByTestId(`ReviewTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));

    // Verify the request URL and params
    expect(axiosMock.history.delete[0].url).toBe("/api/review");
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });
});
