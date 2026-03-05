import React, { useState, useEffect } from "react";
import { HomePage } from "./pages/HomePage";
import { ResultsPage } from "./pages/ResultsPage";
import { IntroPage } from "./pages/IntroPage";
import { usePrediction } from "./hooks/usePrediction";
import type { FormData } from "./components/PredictionForm";

type Page = "intro" | "home" | "results";

const getPageFromHash = (): Page => {
  const hash = window.location.hash.slice(1); // Remove the #
  if (hash === "home" || hash === "results") {
    return hash;
  }
  return "intro";
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash);
  const { loading, error, result, patientData, submitPrediction } =
    usePrediction();

  // Sync state with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (page: Page) => {
    window.location.hash = page;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = async (formData: FormData) => {
    const success = await submitPrediction(formData);
    if (success) {
      navigateTo("results");
    }
  };

  const handleBackToHome = () => {
    navigateTo("home");
  };

  return (
    <>
      {currentPage === "intro" && (
        <IntroPage onGetStarted={() => navigateTo("home")} />
      )}

      {currentPage === "home" && (
        <HomePage
          onFormSubmit={handleFormSubmit}
          loading={loading}
          error={error}
        />
      )}

      {currentPage === "results" && (
        <ResultsPage
          onBackToHome={handleBackToHome}
          riskLevel={result.riskLevel}
          probability={result.probability}
          patientData={patientData}
          initialFollowup={result.followup}
        />
      )}
    </>
  );
}
