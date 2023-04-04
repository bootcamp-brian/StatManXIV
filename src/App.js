import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import NotFound from "./NotFound";
import Root from "./pages/Root";
import Home from "./pages/Home";
  
  const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <NotFound />,
        children: [
            {
              path: "home",
              element: <Home />,
            }
          ],
    },
  ]);
  
  function App() {
    return (
        <div className="App">
            <RouterProvider router={router} />
        </div>
    )
  }
  
  export default App;