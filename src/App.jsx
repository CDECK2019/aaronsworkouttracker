import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import { Dashboard } from "./components/index.js";
import Workouts from "./pages/Workouts.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Progress from "./pages/Progress.jsx";
import History from "./pages/History.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Exercises from "./pages/Exercises.jsx";
import Programs from "./pages/Programs.jsx";
import LandingPage from "./components/LandingPage.jsx";
import CustomProgramBuilder from "./components/CustomProgramBuilder.jsx";
import NutritionTracker from "./components/NutritionTracker.jsx";
import MealPlanLibrary from "./components/MealPlanLibrary.jsx";
import MindfulnessHub from "./components/MindfulnessHub.jsx";
import FinancialHub from "./components/FinancialHub.jsx";
import IntellectualHub from "./components/IntellectualHub.jsx";
import CareerHub from "./components/CareerHub.jsx";
import AdvisorHub from "./components/AdvisorHub.jsx";
import CustomMealBuilder from "./components/CustomMealBuilder.jsx";
import MealPlanDetails from "./components/MealPlanDetails.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />

      {/* App Routes (wrapped in Layout with sidebar) */}
      <Route element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="userprofile" element={<UserProfile />} />
        <Route path="workout" element={<Workouts />} />
        <Route path="progress" element={<Progress />} />
        <Route path="history" element={<History />} />
        <Route path="exercises" element={<Exercises />} />
        <Route path="programs" element={<Programs />} />
        <Route path="programs/create" element={<CustomProgramBuilder />} />
        <Route path="programs/edit/:id" element={<CustomProgramBuilder />} />
        <Route path="nutrition" element={<NutritionTracker />} />
        <Route path="nutrition/plans" element={<MealPlanLibrary />} />
        <Route path="nutrition/plans/:id" element={<MealPlanDetails />} />
        <Route path="nutrition/create" element={<CustomMealBuilder />} />
        <Route path="mindfulness" element={<MindfulnessHub />} />
        <Route path="financial" element={<FinancialHub />} />
        <Route path="intellectual" element={<IntellectualHub />} />
        <Route path="career" element={<CareerHub />} />
        <Route path="advisor" element={<AdvisorHub />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
