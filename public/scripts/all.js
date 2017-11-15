var guildFilters = Vue.component("guild-filters", {
  template: `<div class="filters">
  <div class="input-group">
    <label for="minimumLevelFilter">Enter Minimum member level to filter by</label>
    <input id="minimumLevelFilter" name="minimumLevelFilter" type="number" v-model.number="filters.level" />
  </div>
  <div class="input-group">
    <label for="raceFilter">Filter by Race</label>
    <select id="raceFilter" name="raceFilter" v-model.number="filterBy.race" @change="updateFilters('race')">
      <option></option>
      <option v-for="(race, key) in races" :value="key">{{race}}</option>
    </select>
  </div>
  <div v-if="urlParams">
    <ul>
      <li v-for="(urlParam, key) in urlParams">{{key}}: {{urlParam}}</li>
    </ul>
  </div>
  <div class="input-group">
    <label for="classFilter">Filter by Class</label>
    <select id="classFilter" name="classFilter" v-model.number="filterBy.classId" @change="updateFilters('classId')">
      <option></option>
      <option v-for="(classId, key) in classes" :value="key">{{classId}}</option>
    </select>
  </div>
</div>`,
  created: function(){
    if(this.$route.query){
      this.urlParams = this.$route.query;
    }
  },
  //props: ["guildies", "levelLimit"],
  data: function() {
    return {
      filterBy: {},
      urlParams: {}
    };
  },
  computed: {
    filters() {
      return this.$store.state.filters
    },
    races() {
      return this.$store.state.races
    },
    classes() {
      return this.$store.state.classes
    }
  },
  methods: {
    updateFilters(filterName){
      var app = this;
      this.$store.dispatch("updateFilters", {filterName, filter: app.filterBy[filterName]});
    }
  }
});

var guildWrapper = Vue.component("guild-stats", {
  template: `<div>
  <h2>{{totalMembers}} Members (at least level {{levelLimit}})</h2> 

  <div v-if="guildies.length > 0">
    <h2>Races</h2>
    <ul>
      <li v-for="(race, key) in races" v-show="numberOfRace(key) > 0">
        {{race}} {{numberOfRace(key)}}
      </li>
    </ul>

    <h2>Classes</h2>
    <ul>
      <li v-for="(characterClass, key) in classes" v-show="numberOfClass(key) > 0">
        {{ characterClass }} {{numberOfClass(key)}}
      </li>
    </ul>
  </div>
  </div>`,
  props: ["guildies", "levelLimit"],
  data: function() {
    return {
      
    };
  },
  created: function() {
    
  },
  computed: {
    races() {
      return this.$store.state.races
    },
    classes() {
      return this.$store.state.classes
    },
    totalMembers() {
      return this.guildies.length
    }
  },
  methods: {
    numberOfRace(raceId) {
      var membersOfRace = this.guildies.filter(function(member){
        return member.character.race.toString() === raceId;
      });
      return membersOfRace.length;
    },
    numberOfClass(classId) {
      var membersOfClass = this.guildies.filter(function(member){
        return member.character.class === classId;
      });
      return membersOfClass.length;
    }
  }
});

var guildWrapper = Vue.component("guild-wrapper", {
  template: `<div>
  <h1>Guild Stats</h1>
  <guild-filters></guild-filters>

  <guild-stats :guildies="filteredGuildies" :levelLimit="filters.level"></guild-stats>
  <h1>List of Guild Members</h1>
  <ul>
    <li v-for="member in guildies10">
      <img :src="'https://us.battle.net/static-render/us/' + member.character.thumbnail" v-on:error="replaceImage($event)" alt="" />
      <p>{{ member.character.name }}</p>
      <p>Level {{member.character.level}} {{getRaceName(member.character.race)}} {{getClassName(member.character.class)}}</p>
    </li>
  </ul>
  </div>`,
  //props: ["id", "category"],
  data: function() {
    return {
      
    };
  },
  created: function() {
  },
  mounted: function(){
    
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
    filters: function(){
      return this.$store.state.filters
    },
    filteredGuildies: function (){
      return this.filterGuildies()
    },
    /* temp to only load 10 people */
    guildies10: function (){
      return this.filteredGuildies.slice(0, 10)
    }
  },
  methods: {
    replaceImage: function(event) {
      // if the image returns a 404 we'll replace it with a placeholder
      event.target.src = "http://www.placeunicorn.com/84x84";
    },
    getRaceName: function(raceId) {
      return this.races[raceId]
    },
    getClassName: function(classId) {
      return this.classes[classId]
    },
    filterGuildies: function(){
      const app = this;

      let members = app.$store.state.guild.members || [];

      function filterMember(member) {
        let returnMember;
        let filtersArray = Object.keys(app.filters);

        for(let i = 0; i < filtersArray.length; i++){
          if(typeof(app.filters[filtersArray[i]]) === 'string' || (typeof(app.filters[filtersArray[i]] === 'number') && filtersArray[i] !== 'level')) {
            // because classId !== class, we have to do this special check...
            if(filtersArray[i] === 'classId') {
              if(member.character['class'] === app.filters[filtersArray[i]]) {
                returnMember = member;
              } else {
                returnMember = undefined;
                break;
              }
            } else { // not class
              if(member.character[filtersArray[i]] === app.filters[filtersArray[i]]) {
                returnMember = member;
              } else {
                returnMember = undefined;
                break;
              }
            }
            // level
          } else if( typeof(app.filters[filtersArray[i]] === 'number') && filtersArray[i] === 'level'){
            if(member.character[filtersArray[i]] >= app.filters[filtersArray[i]]) {
              returnMember = member;     
            } else {
              returnMember = undefined;
              break;
            }
          }
        }
        
        return returnMember;
      }
      
      let filtered = members.reduce(function(filteredMembers, member) {
        let filteredMember = filterMember(member);
        return typeof(filteredMember) === "undefined" ? filteredMembers : filteredMembers.concat(filteredMember);
      }, []);
      return filtered;
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
    filters: {
      level: 110
    },
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
    },
    setFilter: function(state, filterObj) {
      let name = filterObj.filterName;
      let filter = filterObj.filter;
      return Vue.set(state.filters, name, filter);
    },
    removeFilter: function(state, filterObj) {
      return Vue.delete(state.filters, filterObj.filterName);
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
    },
    updateFilters: function(context, filterObj) {
      if(filterObj.filter){
        // if the filter itself is set to something, we add/update it
        context.commit("setFilter", filterObj);
      } else {
        // if the filter is empty, we'll remove it from the filters
        context.commit("removeFilter", filterObj);
      }
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