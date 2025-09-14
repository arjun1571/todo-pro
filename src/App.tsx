import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "@/pages/Register";
import TodosPage from "@/pages/TodosPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Login from "./pages/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/todos" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/app" element={<ProtectedRoute />}>
        <Route path="todos" element={<TodosPage />} />
        <Route index element={<Navigate to="todos" replace />} />
      </Route>
      <Route path="*" element={<div className="p-6">Not found</div>} />
    </Routes>
  );
}
