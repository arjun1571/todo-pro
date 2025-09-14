import { render } from "@testing-library/react";
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { MemoryRouter } from "react-router-dom";
import Login from "@/pages/Login";

test("form validation errors appear", async () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );
  fireEvent.change(screen.getByLabelText(/Email/i), {
    target: { value: "bad" },
  });
  fireEvent.change(screen.getByLabelText(/Password/i), {
    target: { value: "1" },
  });
  fireEvent.click(screen.getByText(/Login/i));
  expect(await screen.findByText(/Invalid email/i)).toBeInTheDocument();
  expect(await screen.findByText(/at least 6/i)).toBeInTheDocument();
});
