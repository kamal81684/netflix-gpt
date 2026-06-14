import Header from "./Header";
import Login from "./Login";
import Browse from "./browse";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Body = () => {
    const appRouter = createBrowserRouter([
        {
            path: "/",
            element: <Login/>
        },
        {
            path: "/browse",
            element: <Browse/>
        }

    ])
    return <div>
       <RouterProvider router={appRouter} />
    </div>
}

export default Body;