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
