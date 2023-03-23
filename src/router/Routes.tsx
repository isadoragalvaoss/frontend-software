import { Button, Result } from "antd";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const Router = (): JSX.Element => {
  const Main = lazy(() => import("../pages/Main"));
  const Users = lazy(() => import("../components/Users"));
  const Assets = lazy(() => import("../pages/Assets"));
  const Dashboard = lazy(() => import("../pages/Dashboard"));

  const FallbackPage = <>Loading</>;

  return (
    <>
      <Routes>
        <Route
          path="/main"
          element={
            <Suspense fallback={FallbackPage}>
              <Main />
            </Suspense>
          }
        />
        <Route
          path="/users"
          element={
            <Suspense fallback={FallbackPage}>
              <Users />
            </Suspense>
          }
        />
        <Route
          path="/assets"
          element={
            <Suspense fallback={FallbackPage}>
              <Assets />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={FallbackPage}>
              <Dashboard />
            </Suspense>
          }
        />

        <Route
          path="*"
          element={
            <Suspense fallback={FallbackPage}>
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary">Back Home</Button>}
              />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
};
export default Router;
