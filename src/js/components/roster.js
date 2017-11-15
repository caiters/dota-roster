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
