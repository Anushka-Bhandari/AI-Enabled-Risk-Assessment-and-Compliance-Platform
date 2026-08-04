import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import SecurityCommandCenter from "./pages/SecurityCommandCenter";

import NewAssessment from "./pages/NewAssessment";
import QuestionnaireAssessment from "./pages/QuestionnaireAssessment";
import UploadAssessment from "./pages/UploadAssessment";
import AssessmentResult from "./pages/AssessmentResult";
import AssessmentHistory from "./pages/AssessmentHistory";
import Landing from "./pages/Landing";
import ComplianceReports from "./pages/ComplianceReports";



import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Landing />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/compliance-reports"
                    element={
                        <ProtectedRoute>
                            <ComplianceReports />
                        </ProtectedRoute>
                    }
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
                    path="/SecurityCommandCenter"
                    element={
                        <SecurityCommandCenter />
                    }
                />

                <Route
                    path="/assessment-history"
                    element={
                        <ProtectedRoute>
                            <AssessmentHistory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/assessments/new"
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