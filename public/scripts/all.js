var guildWrapper = Vue.component("guild-stats", {
  template: `<div>
  <h2>Races</h2>
  <ul>
    <li>Humans {{numberOfRace(1)}}</li>
    <li>Night Elves {{numberOfRace(4)}}</li>
    <li>Gnomes {{numberOfRace(7)}}</li>
  </ul>
  </div>`,
  props: ["guildies"],
  data: function() {
    return {
      
    };
  },
  created: function() {
    
  },
  computed: {
  },
  methods: {
    numberOfRace: function(raceId){
      var membersOfRace = this.guildies.filter(function(member){
        return member.character.race === raceId;
      });
      return membersOfRace.length;
    }
  }
});

var guildWrapper = Vue.component("guild-wrapper", {
  template: `<div>
  <p>Hello</p>
  <h1>Guild Stats</h1>
  <guild-stats :guildies="guildiesMaxLevel"></guild-stats>
  <h1>List of Guild Members</h1>
  <ul>
    <li v-for="member in guildies10">
      <img :src="'https://us.battle.net/static-render/us/' + member.character.thumbnail" :alt="member.character.name" />
      <p>{{ member.character.name }}</p>
      <p>{{getRaceName(member.character.race)}} {{getClassName(member.character.class)}}</p>
    </li>
  </ul>
  </div>`,
  //props: ["id", "category"],
  data: function() {
    return {
      maxLevel: 110
    };
  },
  created: function() {
    
  },
  computed: {
    guild: function(){
      return this.$store.state.guild
    },
    races: function(){
      return this.$store.state.races
    },
    classes: function(){
      return this.$store.state.classes
    },
    guildiesMaxLevel: function (){
      var app = this;
      return (app.$store.state.guild.members || []).filter(function(member){
        if(member.character.level >= app.maxLevel){
          return member;
        }
      })
    },
    warriors: function(){
      return (this.guildiesMaxLevel || []).filter(function(member){
        if(member.character.class === 1){
          return member;
        }
      });
    },
    /* temp to only load 10 people */
    guildies10: function (){
      return this.warriors.slice(0, 10)
    }
  },
  methods: {
    getRaceName: function(raceId) {
      return this.races[raceId]
    },
    getClassName: function(classId) {
      return this.classes[classId]
    }
  }
});

var get = function(path) {
  return fetch(path, { credentials: "same-origin" }).then(function(res) {
    return res.json();
  });
};

var store = new Vuex.Store({
  state: {
    guild: {},
    races: {},
    classes: {},
    loading: 0
  },
  mutations: {
    loading: function(state) {
      return Object.assign(state, { loading: state.loading + 1 });
    },
    doneLoading: function(state) {
      return Object.assign(state, { loading: Math.max(0, state.loading - 1) });
    },
    setGuildMembers: function(state, data) {
      return Object.assign(state, { guild: data });
    },
    setRaces: function(state, data){
      let allianceRaces = {};

      // get only races marked as alliance
      let allianceRaceArray = data.races.filter(function(race){
        return race.side === "alliance";
      });

      // update allianceRaces object with each alliance race in the format we want
      allianceRaceArray.forEach(function(race){
        allianceRaces[race.id] = race.name;
      });
      
      return Object.assign(state, { races: allianceRaces });
    },
    setClasses: function(state, data){
      let classes = {};
      
      // update classes object with each class in the format we want
      data.classes.forEach(function(classObj){
        classes[classObj.id] = classObj.name;
      });
      return Object.assign(state, { classes: classes });
    }
  },
  actions: {
    load: function(context) {
      context.commit("loading");
      let guildies = get("https://us.api.battle.net/wow/guild/Bronzebeard/Daughters%20OfThe%20Alliance?fields=members&locale=en_US&apikey=cb6fsvp6pvf5h7hz9sw2th4p9aax4ywp")
        .then(function(guildies) {
          context.commit("setGuildMembers", guildies);
        });
      let races = get("https://us.api.battle.net/wow/data/character/races?locale=en_US&apikey=cb6fsvp6pvf5h7hz9sw2th4p9aax4ywp")
        .then(function(races){
          context.commit("setRaces", races);
        });
      let classes = get("https://us.api.battle.net/wow/data/character/classes?locale=en_US&apikey=cb6fsvp6pvf5h7hz9sw2th4p9aax4ywp")
        .then(function(classes){
          context.commit("setClasses", classes);
        });
      return Promise.all([guildies, races, classes]).then(function() {
        context.commit("doneLoading");
      });
    }
  }
});

var routes = [
  { path: "/", component: guildWrapper }
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