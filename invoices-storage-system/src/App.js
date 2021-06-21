import React, { useContext } from "react";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";

import Login from "./components/Login/Login";
import Main from "./components/Main/Main";
import { AuthContext } from "./contexts/AuthProvider";

const App = (props) => {
  const { userAcc } = useContext(AuthContext);

  return (
    <ThemeContextWrapper>
      <BackgroundColorWrapper>
        {!userAcc ? <Login /> : <Main />}
      </BackgroundColorWrapper>
    </ThemeContextWrapper>
  );
};

export default App;
