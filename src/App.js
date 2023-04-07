import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './App.css'
import NotFound from "./NotFound";
import Root from "./pages/Root";
  
  const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <NotFound />,
        children: [],
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