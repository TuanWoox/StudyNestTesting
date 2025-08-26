// App.tsx or main.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { Toaster } from 'sonner';
import { Provider } from "react-redux";
import { store } from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster richColors expand={false} position="top-right" />
    </Provider>
  )
}

export default App;
