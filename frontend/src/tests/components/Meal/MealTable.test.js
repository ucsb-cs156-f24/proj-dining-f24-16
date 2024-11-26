import { render, screen } from "@testing-library/react";
import { mealFixtures } from "fixtures/mealFixtures";
import MealTable from "main/components/Meal/MealTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("MealTable tests", () => {
  const queryClient = new QueryClient();

  const dateTime = "2024-11-25";
  const diningCommonsCode = "portola";

  const expectedHeaders = ["Meal"];
  const expectedFields = ["name"];
  const testId = "MealTable";

  test("renders empty table correctly", () => {

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MealTable meals={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(
        `${testId}-cell-row-0-col-${field}`,
      );
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MealTable
            meals={mealFixtures.threeMeals}
            dateTime = {dateTime}
            diningCommonsCode = {diningCommonsCode}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-name`),
    ).toHaveTextContent("Breakfast");
    const bLink = screen.getByText('Breakfast'); // The link text
    expect(bLink).toHaveAttribute(
        'href',
        '/api/diningcommons/2024-11-25/portola/breakfast'
      );


    expect(
        screen.getByTestId(`${testId}-cell-row-1-col-name`),
      ).toHaveTextContent("Lunch");
    const lLink = screen.getByText('Lunch'); // The link text
    expect(lLink).toHaveAttribute(
        'href',
        '/api/diningcommons/2024-11-25/portola/lunch'
    );

    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-name`),
    ).toHaveTextContent("Dinner");
    const dLink = screen.getByText('Dinner'); // The link text
    expect(dLink).toHaveAttribute(
        'href',
        '/api/diningcommons/2024-11-25/portola/dinner'
    );

});

});