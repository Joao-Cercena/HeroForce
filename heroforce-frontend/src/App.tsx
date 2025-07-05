import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ProjectDetails from "./pages/ProjectDetails";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from "./context/ToastContext";
import NewProject from "./pages/NewProject";
import EditProject from "./pages/EditProject";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects/new" element={<NewProject />} />{" "}
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/projects/:id/edit" element={<EditProject />} />
            </Route>
             <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
