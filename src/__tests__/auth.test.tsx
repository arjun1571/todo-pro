import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "@/App";

test("redirects to login for protected route", async () => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/app/todos"]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
  expect(await screen.findByText(/Login/i)).toBeInTheDocument();
});
