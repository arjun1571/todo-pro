import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "@/redux/store";
import { toggleTheme } from "@/redux/features/ui/uiSlice";
import { logout } from "@/redux/features/auth/authSlice";
import Alert from "./core/Alert/Alert";
import LogOutLogo from "@/assets/image/logOut.png";

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);
  const theme = useSelector((s: RootState) => s.ui.theme);
  const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // handlers
  const handleLogout = () => {
    dispatch(logout());
    setIsAlertOpen(false);
  };

  const handleCancel = () => {
    setIsAlertOpen(false);
  };

  return (
    <nav className="border-b bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800">
      {/* Logout Confirmation Alert */}
      <Alert
        isOpen={isAlertOpen}
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        onConfirm={handleLogout}
        onCancel={handleCancel}
      >
        <h3 className="text-2xl font-bold">Confirm Logout</h3>
        <h6 className="text-md my-4">Are you sure you want to log out?</h6>
        <div className="flex items-center justify-center my-8">
          <img className="h-28 w-auto" src={LogOutLogo} alt="Log out" />
        </div>
      </Alert>

      <div className="min-w-container py-3 flex items-center justify-between lg:px-10 md:px-6 px-4">
        {/* Logo */}
        <Link
          to="/"
          className="font-bold text-lg text-zinc-800 dark:text-zinc-100 text-nowrap"
        >
          Todo Pro
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="px-3 py-1 rounded border dark:border-zinc-700"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

          {user ? (
            <>
              <span className="text-sm text-zinc-700 dark:text-zinc-200">
                {user.email}
              </span>
              <button
                onClick={() => setIsAlertOpen(true)}
                className="px-3 py-1 rounded bg-red-600 text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 rounded bg-blue-600 text-white"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
