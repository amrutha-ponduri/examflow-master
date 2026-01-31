import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import 'katex/dist/katex.min.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import QuestionBankView from "./pages/QuestionBankView";
import QuestionGeneration from "./pages/QuestionGeneration";
import QuestionBankUpload from "./pages/QuestionBankUpload";
import ProgramsListing from "./pages/ProgramsListing";
import ProgramFormPage from "./pages/ProgramFormPage";
import CoursesListing from "./pages/CoursesListing";
import CourseFormPage from "./pages/CourseFormPage";
import UsersListing from "./pages/UsersListing";
import UserFormPage from "./pages/UserFormPage";
import DepartmentsListing from "./pages/DepartmentsListing";
import DepartmentFormPage from "./pages/DepartmentFormPage";
import RegulationsListing from "./pages/RegulationsListing";
import RegulationFormPage from "./pages/RegulationFormPage";
import CourseOfferingsListing from "./pages/CourseOfferingsListing";
import CourseOfferingFormPage from "./pages/CourseOfferingFormPage";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/question-bank/:id" element={<QuestionBankView />} />
            <Route path="/generate" element={<QuestionGeneration />} />
            <Route path="/upload" element={<QuestionBankUpload />} />
            
            {/* Programs */}
            <Route path="/programs" element={<ProgramsListing />} />
            <Route path="/programs/add" element={<ProgramFormPage />} />
            <Route path="/programs/edit/:id" element={<ProgramFormPage />} />
            
            {/* Courses */}
            <Route path="/courses" element={<CoursesListing />} />
            <Route path="/courses/add" element={<CourseFormPage />} />
            <Route path="/courses/edit/:id" element={<CourseFormPage />} />
            
            {/* Users */}
            <Route path="/users" element={<UsersListing />} />
            <Route path="/users/add" element={<UserFormPage />} />
            <Route path="/users/edit/:id" element={<UserFormPage />} />
            
            {/* Departments */}
            <Route path="/departments" element={<DepartmentsListing />} />
            <Route path="/departments/add" element={<DepartmentFormPage />} />
            <Route path="/departments/edit/:id" element={<DepartmentFormPage />} />
            
            {/* Regulations */}
            <Route path="/regulations" element={<RegulationsListing />} />
            <Route path="/regulations/add" element={<RegulationFormPage />} />
            <Route path="/regulations/edit/:id" element={<RegulationFormPage />} />
            
            {/* Course Offerings */}
            <Route path="/course-offerings" element={<CourseOfferingsListing />} />
            <Route path="/course-offerings/add" element={<CourseOfferingFormPage />} />
            <Route path="/course-offerings/edit/:id" element={<CourseOfferingFormPage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
