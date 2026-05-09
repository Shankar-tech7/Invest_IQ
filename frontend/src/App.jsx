import React, { useState } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
 Navigate,
  useLocation
} from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import AutopsyPage from "./pages/AutopsyPage";
import CCTVPage from "./pages/CCTVPage";
import EvidencePage from "./pages/EvidencePage";
import TODPage from "./pages/TODPage";
import ReconstructionPage from "./pages/ReconstructionPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";

import ChatbotWidget from "./components/ChatbotWidget";
import DNABackground from "./components/DNABackground";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
    filter: "blur(8px)"
  },

  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },

  exit: {
    opacity: 0,
    y: -15,
    filter: "blur(8px)",
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}

function Layout({ children, setIsLoggedIn }) {
  return (
    <div className="flex h-screen overflow-hidden text-slate-200 relative z-10">

      <Sidebar setIsLoggedIn={setIsLoggedIn} />

      <div className="flex-1 flex flex-col relative bg-transparent">

        <Header />

        <main className="flex-1 overflow-y-auto p-6 bg-transparent">
          {children}
        </main>

        <ChatbotWidget />

      </div>
    </div>
  );
}

function AnimatedRoutes({
  isLoggedIn,
  onLogin,
  setIsLoggedIn
}) {

  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Routes location={location} key="auth">

        <Route
          path="/login"
          element={<LoginPage onLogin={onLogin} />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    );
  }

  return (
    <AnimatePresence mode="wait">

      <Routes location={location} key={location.pathname}>

        <Route
          path="/"
          element={
            <PageWrapper>
              <LandingPage />
            </PageWrapper>
          }
        />

        <Route
          path="/dashboard"
          element={
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <PageWrapper>
                <DashboardPage />
              </PageWrapper>
            </Layout>
          }
        />

        <Route
          path="/autopsy"
          element={
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <PageWrapper>
                <AutopsyPage />
              </PageWrapper>
            </Layout>
          }
        />

        <Route
          path="/tod"
          element={
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <PageWrapper>
                <TODPage />
              </PageWrapper>
            </Layout>
          }
        />

        <Route
          path="/cctv"
          element={
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <PageWrapper>
                <CCTVPage />
              </PageWrapper>
            </Layout>
          }
        />

        <Route
          path="/evidence"
          element={
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <PageWrapper>
                <EvidencePage />
              </PageWrapper>
            </Layout>
          }
        />

        <Route
          path="/reconstruction"
          element={
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <PageWrapper>
                <ReconstructionPage />
              </PageWrapper>
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <PageWrapper>
                <ProfilePage />
              </PageWrapper>
            </Layout>
          }
        />

        <Route
          path="/settings"
          element={
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <PageWrapper>
                <SettingsPage />
              </PageWrapper>
            </Layout>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </AnimatePresence>
  );
}

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("investiq_user")
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("investiq_user")) || null
  );

  const handleLogin = (userData) => {

    localStorage.setItem("isLoggedIn", "true");

    localStorage.setItem(
      "investiq_user",
      JSON.stringify(userData)
    );

    setIsLoggedIn(true);

    setUser(userData);
  };

  return (
    <Router>

      <DNABackground />

      <AnimatedRoutes
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        setIsLoggedIn={setIsLoggedIn}
      />

    </Router>
  );
}