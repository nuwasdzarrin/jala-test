<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white">
    <router-link to="/" class="navbar-brand">Pilih Lokasi</router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <form class="form-inline my-2 my-lg-0">
        <div class="autocomplete">
          <input
            style="width:300px;"
            type="text"
            placeholder="semua lokasi"
            @input="onChange"
            v-model="search"
            @keydown.down="onArrowDown"
            @keydown.up="onArrowUp"
            @keydown.enter="onEnter"
          />
          <ul id="autocomplete-results" v-show="isOpen" class="autocomplete-results">
            <li class="loading" v-if="isLoading">Loading results...</li>
            <li
              v-else
              v-for="(result, i) in results"
              :key="i"
              @click="setResult(result)"
              class="autocomplete-result"
              :class="{ 'is-active': i === arrowCounter }"
            >{{ result.full_name }}</li>
          </ul>
        </div>
      </form>
    </div>
  </nav>
</template>
<script>
import Api from "../api";
export default {
  name: "autocomplete",
  data() {
    return {
      isOpen: false,
      myItems: [],
      results: [],
      search: "",
      idSearch: "",
      isLoading: false,
      arrowCounter: 0,
      filter: {
        search: "",
        with: "creator,species,region",
        sort: "size_100|creator.name,desc",
        region_id: ""
      }
    };
  },
  props: {
    isAsync: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  methods: {
    getData() {
      const params = {
        search: this.filter.search,
        with: this.filter.with,
        sort: this.filter.sort,
        region_id: this.filter.region_id
      };
      Api.shrimp_prices
        .filter(params)
        .then(res => {
          for (let key in res.data.data) {
            this.myItems.push({
              id: res.data.data[key].region.id,
              full_name: res.data.data[key].region.full_name
            });
          }
        })
        .catch(err => {
          throw err;
          alert(err);
        });
    },
    onChange() {
      // Let's warn the parent that a change was made
      this.$emit("input", this.search);

      // Is the data given by an outside ajax request?
      if (this.isAsync) {
        this.isLoading = true;
      } else {
        // Let's  our flat array
        this.filterResults();
        this.isOpen = true;
      }
    },

    filterResults() {
      // first uncapitalize all the things
      this.results = this.myItems.filter(item => {
        return (
          item.full_name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        );
      });
    },
    setResult(result) {
      this.idSearch = result.id;
      this.isOpen = false;
      this.$router.push({
        name: "Result",
        params: { id: this.idSearch }
      });
    },
    onArrowDown(evt) {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    onEnter() {
      this.search = this.results[this.arrowCounter];
      this.isOpen = false;
      this.arrowCounter = -1;
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
        this.arrowCounter = -1;
      }
    }
  },
  watch: {
    items: function(val, oldValue) {
      // actually compare them
      if (val.length !== oldValue.length) {
        this.results = val;
        this.isLoading = false;
      }
    }
  },
  mounted() {
    var self = this;
    self.getData();
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  }
};
</script>
<style>
.autocomplete {
  position: relative;
  width: 300px;
  margin-left: 100px;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  overflow: auto;
  width: 100%;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
  background-color: #4aae9b;
  color: white;
}
</style>