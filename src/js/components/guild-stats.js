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
