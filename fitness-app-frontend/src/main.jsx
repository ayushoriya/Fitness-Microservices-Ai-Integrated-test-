// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import { Provider } from "react-redux";
// import { store } from "./store/store";
// import { AuthProvider } from "react-oauth2-code-pkce";
// import { authConfig } from "./authConfig.js";

// ReactDOM.createRoot(document.getElementById("root"))
// root.render(
//   <AuthProvider authConfig={authConfig}
//                loadingComponent={<div>Loading...</div>}>
  
//     <Provider store={store}>
//       <App />    
//     </Provider>
//     </AuthProvider>,
  
// );
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthProvider } from "react-oauth2-code-pkce";
import { authConfig } from "./authConfig.js";

// ✅ Assign the root
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider
      authConfig={authConfig}
      loadingComponent={<div>Loading...</div>}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);
