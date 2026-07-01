import ColorPage from "./components/ColorPage";
import ErrorBoundary from "./components/error/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ColorPage />
    </ErrorBoundary>
  );
}

export default App;
