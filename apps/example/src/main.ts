import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/github-dark.css';
import './load-pages';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');
