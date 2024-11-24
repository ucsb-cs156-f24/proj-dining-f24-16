// frontend/src/main/components/Review/ReviewForm.test.js

import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ReviewForm from "main/components/Review/ReviewForm";
import { ReviewFixtures } from "fixtures/reviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ReviewForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <ReviewForm />
      </Router>
    );
    await screen.findByText(/Student ID/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a Review", async () => {
    render(
      <Router>
        <ReviewForm initialContents={ReviewFixtures.oneReview} />
      </Router>
    );
    await screen.findByTestId("ReviewForm-id");
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId("ReviewForm-id")).toHaveValue("1");
    expect(screen.getByTestId("ReviewForm-status")).toHaveValue("Awaiting Moderation");
  });

  test("Correct error messages on bad input", async () => {
    render(
      <Router>
        <ReviewForm />
      </Router>
    );
    await screen.findByTestId("ReviewForm-studentId");

    const studentIdField = screen.getByTestId("ReviewForm-studentId");
    const itemIdField = screen.getByTestId("ReviewForm-itemId");
    const dateItemServedField = screen.getByTestId("ReviewForm-dateItemServed");
    const starsField = screen.getByTestId("ReviewForm-stars");
    const commentsField = screen.getByTestId("ReviewForm-comments");
    const submitButton = screen.getByTestId("ReviewForm-submit");

    fireEvent.change(studentIdField, { target: { value: "bad-input" } });
    fireEvent.change(itemIdField, { target: { value: "bad-input" } });
    fireEvent.change(dateItemServedField, { target: { value: "bad-input" } });
    fireEvent.change(starsField, { target: { value: "6" } }); // Invalid stars
    fireEvent.change(commentsField, { target: { value: "" } }); // Missing comments
    fireEvent.click(submitButton);

    await screen.findByText(/Student ID must be a positive integer/);
    expect(screen.getByText(/Item ID must be a positive integer/)).toBeInTheDocument();
    expect(screen.getByText(/Date Item Served is required/)).toBeInTheDocument();
    expect(screen.getByText(/Stars must be between 1 and 5/)).toBeInTheDocument();
    expect(screen.getByText(/Comments are required/)).toBeInTheDocument();
  });

  test("No error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <ReviewForm submitAction={mockSubmitAction} />
      </Router>
    );
    await screen.findByTestId("ReviewForm-studentId");

    const studentIdField = screen.getByTestId("ReviewForm-studentId");
    const itemIdField = screen.getByTestId("ReviewForm-itemId");
    const dateItemServedField = screen.getByTestId("ReviewForm-dateItemServed");
    const starsField = screen.getByTestId("ReviewForm-stars");
    const commentsField = screen.getByTestId("ReviewForm-comments");
    const submitButton = screen.getByTestId("ReviewForm-submit");

    fireEvent.change(studentIdField, { target: { value: "1" } });
    fireEvent.change(itemIdField, { target: { value: "7" } });
    fireEvent.change(dateItemServedField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.change(starsField, { target: { value: "5" } });
    fireEvent.change(commentsField, { target: { value: "Great food!" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/Student ID is required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Item ID is required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Date Item Served is required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Stars must be between 1 and 5/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Comments are required/)).not.toBeInTheDocument();
  });

  test("navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <ReviewForm />
      </Router>
    );
    await screen.findByTestId("ReviewForm-cancel");
    const cancelButton = screen.getByTestId("ReviewForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
