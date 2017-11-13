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
