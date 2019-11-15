// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui'
import GetGithubGraphQL from './GithubGraphQL.js'

Vue.use( Mint )

Vue.config.productionTip = false;

const szToken = '83b229b1d86efc780ce20d930511ad07c1111361';
const szData =
{
  query: `query {
  	user(login:"lance-loong"){
    login
    email
  }
}`
};

GetGithubGraphQL( false, szToken, szData, ( response, error ) =>
{
  console.log( response );
  console.log( error );
} );

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
