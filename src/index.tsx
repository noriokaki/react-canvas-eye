import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import WatchingYou from "./WatchingYou";

ReactDOM.render(React.createElement(WatchingYou), document.getElementById("root"));

serviceWorker.register();
