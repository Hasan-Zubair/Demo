import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { HelmetProvider } from 'react-helmet-async';
import theme from "./theme";
import PrivateRoutes from "./routes/PrivateRoutes";
// css file
import "./App.scss";

// components
import LandingPage from "./pages/LandingPage/LandingPage";
import DetailsPage from "./pages/DetailsPage";
import OnBoardingScreen from "./pages/OnBoardingScreen";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PhoneVerification from "./pages/PhoneVerification";
import CreateNewPassword from "./pages/CreateNewPassword";
import ForgotPassword from "./pages/ForgotPassword";
import TokenVerification from "./pages/TokenVerification";
import SignupSuccess from "./pages/SignupSuccess";
import Settings from "./pages/Settings";
import PublicHeader from "./components/PublicHeader";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/Dashboard/Admin";
import LawyerDashboard from "./pages/Dashboard/Lawyer";
import AddBlog from "./pages/Dashboard/Blog/Add";
import BlogDetail from "./pages/Dashboard/Blog/Detail";
import Blogs from "./pages/Dashboard/Blog/Blogs";
import Terms from "./pages/TermsAndPrivacy/Terms";
import Privacy from "./pages/TermsAndPrivacy/Privacy";

// public widgets
import Youtube from "./components/public-widgets/Youtube";
import Blog from "./components/public-widgets/Blog";
import Podcast from "./components/public-widgets/Podcast";
import Testimonials from "./components/public-widgets/Testimonials";
import Video from "./components/public-widgets/Video";

const App = () => {
  const [email, setEmail] = useState(""); // we are using this to pass email from questionnaire to signup

  useEffect(() => {
    const beforeUnloadHandler = (event) => {
      const rememberMeChoice = localStorage.getItem("rememberMe");
      if (rememberMeChoice !== "true") {
        localStorage.removeItem("LoggedInObj");
        localStorage.removeItem("token");
      }
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            {/* put public routs here */}
            <Route exact path="/" element={<LandingPage />} />
            <Route
              path="/onboarding/:screenId"
              element={<OnBoardingScreen email={email} setEmail={setEmail} />}
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/phone-verification" element={<PhoneVerification />} />
            <Route path="/register/check" element={<TokenVerification />} />
            <Route
              path="/user/password/change/"
              element={<TokenVerification />}
            />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup-success" element={<SignupSuccess />} />
            <Route path="/create-new-password" element={<CreateNewPassword />} />
            <Route path="/header/public-header" element={<PublicHeader />} />
            <Route
              path="/contact/public-contact-form"
              element={<ContactForm />}
            />
            <Route path="/footer/public-footer" element={<Footer />} />
            <Route
              path="/blog/:year/:month/:day/:blogSlug"
              element={<BlogDetail />}
            />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            <Route element={<PrivateRoutes />}>
              {/* put private routs here */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/lawyer" element={<LawyerDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/application/:caseID" element={<DetailsPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/blog/add" element={<AddBlog />} />
            </Route>
            {/* public widgets */}
            <Route path="/public-widgets/youtube" element={<Youtube />} />
            <Route path="/public-widgets/blog" element={<Blog />} />
            <Route path="/public-widgets/podcast" element={<Podcast />} />
            <Route path="/public-widgets/testimonials" element={<Testimonials />} />
            <Route path="/public-widgets/video" element={<Video />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
