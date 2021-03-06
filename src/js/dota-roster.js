var routes = [
  { path: "/", component: guildWrapper, props: (route) => ({ rank: route.query.rank || '' }) }
];

var router = new VueRouter({
  routes: routes
});

var app = new Vue({
  el: "#dota",
  router: router,
  store: store,
  mounted: function() {
    store.dispatch("load");
  },
  computed: {
    
  },
  methods: {
    
  }
}).$mount("#dota");