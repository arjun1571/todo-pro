import { render } from "@testing-library/react";
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { MemoryRouter } from "react-router-dom";
import { setCredentials } from "@/redux/features/auth/authSlice";
import App from "@/App";

function login() {
  store.dispatch(
    setCredentials({
      user: { id: "u1", email: "test@gmail.com" },
      token: "mock-" + (Date.now() + 3600000),
      exp: Date.now() + 3600000,
    })
  );
}

test("filters update list", async () => {
  login();
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/app/todos"]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
  await screen.findByText(/Create Todo/i);
  // Filter by done
  fireEvent.change(screen.getByDisplayValue("All"), {
    target: { value: "done" },
  });
  await waitFor(() =>
    expect(screen.getByText(/Status: done/)).toBeInTheDocument()
  );
});
