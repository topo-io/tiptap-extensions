import React from "react";
import { render } from "react-dom";

import { Tiptap } from "./components";

import { BASIC_CONTENT } from "./data";

import "./index.scss";

render(
  <div id="Wrapper">
    <Tiptap
      content={BASIC_CONTENT}
      withToolbar={true}
      withTaskListExtension={true}
      withLinkExtension={true}
      withEmojisReplacer={true}
    />
  </div>,
  document.getElementById("root")
);
