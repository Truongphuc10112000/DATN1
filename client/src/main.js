import { createApp } from 'vue';
import App from './App.vue';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import globalStyle from '@/assets/globalStyle.css';


// import gAuthPlugin from 'vue3-google-oauth2';

// let gauthClientId = "178270251582-l1agsktv6elmcj513d4rrrqs3bb134jh.apps.googleusercontent.com";





/* import specific icons */
import {
	faUserSecret,
	faCoffee,
	faUser,
	faEnvelope,
	faEye,
	faEyeSlash,
	faChevronLeft,
	faList,
	faShapes,
	faImage,
	faFont,
	faPencil,
	faUpload,
	faBell,
	faAlignLeft,
	faAlignCenter,
	faAlignRight,
	faAlignJustify,
	faListOl,
	faListUl,
	faUndo,
	faRedo,
	faBold,
	faUnderline,
	faItalic,
	faCopy,
	faTrash,
	faMagnifyingGlass,
	faHeart,
	faDownload,
	faEllipsisVertical,
	faCaretDown,
	faPlus,
	faLock,
	faLockOpen,
	faCircleXmark,
	faDrawPolygon,
	
} from '@fortawesome/free-solid-svg-icons';

// import {faCopy} from '@fortawesome/free-regular-svg-icons'

library.add(
	faUserSecret,
	faCoffee,
	faUser,
	faEnvelope,
	faEye,
	faEyeSlash,
	faChevronLeft,
	faList,
	faShapes,
	faImage,
	faFont,
	faPencil,
	faUpload,
	faBell,
	faAlignLeft,
	faAlignCenter,
	faAlignRight,
	faAlignJustify,
	faListOl,
	faListUl,
	faUndo,
	faRedo,
	faBold,
	faUnderline,
	faItalic,
	faCopy,
	faTrash,
	faMagnifyingGlass,
	faHeart,
	faDownload,
	faEllipsisVertical,
	faCaretDown,
	faPlus,
	faLock,
	faLockOpen,
	faCircleXmark,
	faDrawPolygon
);

// import css
import './assets/css/app.css';

// import router
import router from './router';
import store from './store';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";



const app = createApp(App);
app.component('VueDatePicker', VueDatePicker);
app.use(router);
app.use(VueToast);
app.use(store);
app.use(globalStyle);
app.component('icon', FontAwesomeIcon);
// app.use(gAuthPlugin, { clientId: gauthClientId, scope: 'email', prompt: 'consent', fetch_basic_profile: false })

app.component('VPagination', VPagination)
app.mount('#app');
