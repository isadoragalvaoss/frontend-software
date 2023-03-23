import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main";
import AssetsProvider from "./providers/AssetsProvider";
import CompaniesProvider from "./providers/CompaniesProvider";
import ComposeProviders from "./providers/ComposeProviders";
import UnitsProvider from "./providers/UnitsProvider";
import UserProvider from "./providers/UserProvider";
import WorkOrdersProvider from "./providers/WorkOrdersProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
      refetchOnMount: false,
    },
  },
});

const App = (): JSX.Element => {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <ComposeProviders
          with={[
            UserProvider,
            AssetsProvider,
            WorkOrdersProvider,
            UnitsProvider,
            CompaniesProvider,
          ]}
        >
          <Router>
            <Main />
          </Router>
        </ComposeProviders>
      </QueryClientProvider>
    </div>
  );
};

export default App;
