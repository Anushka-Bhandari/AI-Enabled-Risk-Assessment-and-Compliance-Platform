import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";

import NewAssessment from "./pages/NewAssessment";
import QuestionnaireAssessment from "./pages/QuestionnaireAssessment";
import UploadAssessment from "./pages/UploadAssessment";
import AssessmentResult from "./pages/AssessmentResult";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/verify-otp"
                    element={<VerifyOtp />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/assessments"
                    element={
                        <ProtectedRoute>
                            <NewAssessment />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/questionnaire-assessment"
                    element={
                        <ProtectedRoute>
                            <QuestionnaireAssessment />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/upload-assessment"
                    element={
                        <ProtectedRoute>
                            <UploadAssessment />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/assessment/result"
                    element={<AssessmentResult />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;