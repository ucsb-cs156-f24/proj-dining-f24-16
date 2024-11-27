import { render, screen } from "@testing-library/react";
import OrtegaPage from "main/pages/DiningCommons/OrtegaPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("OrtegaPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();
  test("Renders expected content for OrtegaPage", async () => {
    // arrange
    setupUserOnly();

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <OrtegaPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    await screen.findByText("Placeholder for Dining Commons Page for ortega");
  });
});
