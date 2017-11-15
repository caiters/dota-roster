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

  <div class="input-group">
    <label for="classFilter">Filter by Class</label>
    <select id="classFilter" name="classFilter" v-model.number="filterBy.classId" @change="updateFilters('classId')">
      <option></option>
      <option v-for="(classId, key) in classes" :value="key">{{classId}}</option>
    </select>
  </div>
</div>`,
  //props: ["guildies", "levelLimit"],
  data: function() {
    return {
      filterBy: {}
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
