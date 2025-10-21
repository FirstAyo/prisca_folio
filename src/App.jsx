import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import Work from "./pages/Work.jsx";
import GloryBoard from "./pages/GloryBoard.jsx";
import ThePark from "./pages/ThePark.jsx";
import OpenForWork from "./pages/OpenForWork.jsx";

const Page = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const location = useLocation();

  return (
    <>
      <Nav />
      <div className=" max-w-4xl mx-auto site-border">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <Page>
                  <Home />
                </Page>
              }
            />
            <Route
              path="/work"
              element={
                <Page>
                  <Work />
                </Page>
              }
            />
            <Route
              path="/glory"
              element={
                <Page>
                  <GloryBoard />
                </Page>
              }
            />
            <Route
              path="/park"
              element={
                <Page>
                  <ThePark />
                </Page>
              }
            />
            <Route
              path="/open-for-work"
              element={
                <Page>
                  <OpenForWork />
                </Page>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
      <footer className="container-px mx-auto opacity-70 text-sm border-b border-t border-neutral-200/60">
        <p className="container-px max-w-4xl mx-auto h-20 text-center site-border">
          Built with React, Tailwind v4 & Framer Motion.
        </p>
      </footer>
    </>
  );
}
