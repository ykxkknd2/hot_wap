import css from '../assets/css/test.css';

import Vue from 'vue';
import $ from 'jQuery';
import directive from '../public/directive';
import App from '../index/App.vue';

window.vue = new Vue({
  el: '#app',
  render: h => h(App),
    mounted (){
      debugger;
        console.log($('ul').length,111)
    }
});
