
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
    expect(await screen.findByText(/Student ID/)).toBeInTheDocument();
    expect(screen.getByText(/Create/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a Review", async () => {
    render(
      <Router>
        <ReviewForm initialContents={ReviewFixtures.oneReview} />
      </Router>
    );
    expect(await screen.findByTestId("ReviewForm-id")).toHaveValue("1");
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId("ReviewForm-status")).toHaveValue(
      "Awaiting Moderation"
    );
  });

  test("Correct error messages on bad input", async () => {
    render(
      <Router>
        <ReviewForm />
      </Router>
    );

    // Wait for form to render
    await waitFor(() => expect(screen.getByTestId("ReviewForm-studentId")).toBeInTheDocument());

    const studentIdField = screen.getByTestId("ReviewForm-studentId");
    const itemIdField = screen.getByTestId("ReviewForm-itemId");
    const dateItemServedField = screen.getByTestId("ReviewForm-dateItemServed");
    const starsField = screen.getByTestId("ReviewForm-stars");
    const commentsField = screen.getByTestId("ReviewForm-comments");
    const submitButton = screen.getByTestId("ReviewForm-submit");

    // Provide invalid inputs
    fireEvent.change(studentIdField, { target: { value: "bad-input" } });
    fireEvent.change(itemIdField, { target: { value: "bad-input" } });
    fireEvent.change(dateItemServedField, { target: { value: "bad-input" } });
    fireEvent.change(starsField, { target: { value: "6" } }); // Invalid stars
    fireEvent.change(commentsField, { target: { value: "" } }); // Missing comments
    fireEvent.click(submitButton);

    // Check for error messages
    expect(await screen.findByText(/Student ID must be a positive integer/)).toBeInTheDocument();
    expect(screen.getByText(/Item ID must be a positive integer/)).toBeInTheDocument();
    expect(screen.getByText(/Date Item Served is required/)).toBeInTheDocument();
    expect(screen.getByText(/Stars must be between 1 and 5/)).toBeInTheDocument();
    expect(screen.getByText(/Comments are required/)).toBeInTheDocument();
  });

  test("Validation succeeds and submitAction is called on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <ReviewForm submitAction={mockSubmitAction} />
      </Router>
    );

    // Wait for form to render
    await waitFor(() => expect(screen.getByTestId("ReviewForm-studentId")).toBeInTheDocument());

    const studentIdField = screen.getByTestId("ReviewForm-studentId");
    const itemIdField = screen.getByTestId("ReviewForm-itemId");
    const dateItemServedField = screen.getByTestId("ReviewForm-dateItemServed");
    const starsField = screen.getByTestId("ReviewForm-stars");
    const commentsField = screen.getByTestId("ReviewForm-comments");
    const submitButton = screen.getByTestId("ReviewForm-submit");

    // Provide valid inputs
    fireEvent.change(studentIdField, { target: { value: "1" } });
    fireEvent.change(itemIdField, { target: { value: "7" } });
    fireEvent.change(dateItemServedField, { target: { value: "2022-01-02T12:00" } });
    fireEvent.change(starsField, { target: { value: "5" } });
    fireEvent.change(commentsField, { target: { value: "Great food!" } });

    // Ensure no validation errors are shown
    expect(screen.queryByText(/Student ID is required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Item ID is required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Date Item Served is required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Stars must be between 1 and 5/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Comments are required/)).not.toBeInTheDocument();

    fireEvent.click(submitButton);

    // Wait for submitAction to be called
    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    // Verify that submitAction was called with the correct data
    expect(mockSubmitAction).toHaveBeenCalledWith({
      studentId: "1",
      itemId: "7",
      dateItemServed: "2022-01-02T12:00",
      stars: 5,
      comments: "Great food!",
    });
  });

  test("navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <ReviewForm />
      </Router>
    );
    const cancelButton = await screen.findByTestId("ReviewForm-cancel");
    fireEvent.click(cancelButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
