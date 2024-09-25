import "./proxy-polyfill-2";
import { createApp } from "vue";
import App from "./App.vue";
import FocusRoot from "./components/FocusRoot.vue";
import FocusNode from "./components/FocusNode.vue";
import "./style.css";

const app = createApp(App);

app.component("FocusRoot", FocusRoot);
app.component("FocusNode", FocusNode);

app.mount("#app");
