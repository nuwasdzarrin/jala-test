<template>
  <div class="row content">
    <div class="col-sm">
      <div class="row">
        <div class="card">
          <h5 class="card-header bg-white">Persebaran harga udang</h5>
          <div class="card-body">
            <GmapMap
              :center="{lat:-7.7586898, lng:110.39470159999999}"
              :zoom="6"
              map-type-id="terrain"
              style="width: 500px; height: 300px"
            >
              <GmapMarker
                v-for="(marker, index) in mapMark"
                :key="index"
                :position="marker.latLng"
                :icon="markerOptions"
                :label="{
                  color: 'white',
                  fontFamily: 'Material Icons',
                  fontSize: '16px',
                  text: 'Rp '+marker.price.toString(),
                  marginTop: '-115px',
                }"
              />
            </GmapMap>
          </div>
          <div class="card-footer text-center bg-white">
            <div class="map-caption">
              <div class="box grey align-middle"></div>> 1 bulan
            </div>
            <div class="map-caption">
              <div class="box blue align-middle"></div>> 1 minggu
            </div>
            <div class="map-caption">
              <div class="box light-blue align-middle"></div>Baru
            </div>
          </div>
        </div>
      </div>
      <div class="row left-content">
        <div class="card grafik-card">
          <div class="card-header bg-white">
            <h5>Grafik harga udang</h5>
            <span>JAWA TIMUR</span>
          </div>
          <div class="card-body text-center">
            <line-chart :datesPrice="pricesDate" :datesDate="monthPrice" v-if="pricesDate"></line-chart>
          </div>
        </div>
      </div>
    </div>
    <div class="col-sm">
      <div class="card">
        <div class="card-header bg-white">
          <div class="row">
            <div class="col">
              <h5>List harga udang</h5>
            </div>
            <div class="col header-right-col">
              <button class="btn btn-primary btn-xs float-right">TAMBAH HARGA</button>
            </div>
          </div>
        </div>
        <div class="card-body" v-for="n in shrimpPrices" :key="n.id">
          <div class="card bg-light list-content">
            <div class="card-body">
              <div class="row content-list">
                <div class="col">
                  <h6 class="font-weight-bold text-primary">{{ n.region.province_name }}</h6>
                  <div class="text-primary">{{ n.region.regency_name }}</div>
                  <div>{{ n.species.name }}</div>
                  <div>Harga Size 100 :</div>
                  <h4>Rp {{ n.size_100.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</h4>
                </div>
                <div class="col text-right">
                  <div>{{ n.date }}</div>
                  <div class="row shared">
                    <div class="col share">
                      <span class="share-num">25</span>
                      <br />
                      <span class="share-cap">Share</span>
                    </div>
                    <div class="col share">
                      <img src="../assets/icons/whatsapp.svg" class="image-icon" alt="whatsapp" />
                    </div>
                    <div class="col share">
                      <img src="../assets/icons/facebook.svg" class="image-icon" alt="facebook" />
                    </div>
                    <div class="col share">
                      <img src="../assets/icons/twitter.svg" class="image-icon" alt="twitter" />
                    </div>
                    <div class="col share">
                      <img src="../assets/icons/messenger.svg" class="image-icon" alt="messenger" />
                    </div>
                  </div>
                  <div>Penjual:</div>
                  <div>{{ n.creator.name }}</div>
                  <button class="btn btn-outline-primary btn-xs">LIHAT KONTAK</button>
                </div>
              </div>
              <router-link
                class="btn btn-primary btn-sm btn-block"
                :to="{name: 'Detail', params: { id: n.id}}"
              >SEMUA SIZE</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../api";
import LineChart from "../services/LineChart";
import { parse } from "path";
const mapMarker = require("../assets/icons/marker-purple.svg");
export default {
  data() {
    return {
      markerOptions: {
        url: mapMarker,
        scaledSize: { width: 150, height: 40, f: "px", b: "px" }
      },
      mapMark: [],
      shrimpPrices: [],
      pDate: [],
      pricesDate: [],
      monthPrice: [],
      datesDate: [],
      filter: {
        search: "",
        with: "creator,species,region",
        sort: "size_100|creator.name,desc",
        region_id: ""
      }
    };
  },

  components: {
    "line-chart": LineChart
  },
  methods: {
    generate() {
      var self = this;
      for (let key in this.shrimpPrices) {
        this.mapMark.push({
          latLng: {
            lat: parseFloat(this.shrimpPrices[key].region.latitude),
            lng: parseFloat(this.shrimpPrices[key].region.longitude)
          },
          price: this.shrimpPrices[key].size_100
        });
      }
      console.log(this.mapMark);
      self.sortPriceDate();
    },
    filterShrimpPrice() {
      var self = this;
      const params = {
        search: this.filter.search,
        with: this.filter.with,
        sort: this.filter.sort,
        region_id: this.filter.region_id
      };
      Api.shrimp_prices
        .filter(params)
        .then(res => {
          this.shrimpPrices = res.data.data;
          self.generate();
        })
        .catch(err => {
          throw err;
          alert(err);
        });
    },
    sortPriceDate() {
      var self = this;
      this.pDate = this.shrimpPrices.sort(function(a, b) {
        return new Date(a.date) - new Date(b.date);
      });
      self.myPriceDate();
    },
    myPriceDate() {
      var self = this;
      for (let key in this.pDate) {
        this.datesDate.push(this.pDate[key].date);
        this.pricesDate.push(this.pDate[key].size_100);
      }
      self.xAbsis();
    },
    xAbsis() {
      var bln = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Oct",
        "Nov",
        "Des"
      ];
      for (let key in this.datesDate) {
        var mont = parseInt(this.datesDate[key].split("-")[1]);
        var thn = parseInt(this.datesDate[key].split("-")[0]);
        this.monthPrice.push(bln[mont - 1] + " " + thn);
      }
      console.log(this.monthPrice);
    }
  },
  watch: {
    "$route.params.id"(val) {
      var self = this;
      self.filter.region_id = this.$route.params.id;
      self.filterShrimpPrice();
    }
  },
  mounted() {
    var self = this;
    this.filter.region_id = this.$route.params.id;
    self.filterShrimpPrice();
  }
};
</script>
<style>
.content {
  margin-top: 15px;
}

.left-content {
  margin-top: 20px;
  font-size: small;
}

.content-list {
  margin-bottom: 10px;
}

.grafik-card {
  width: 542px;
}

.map-caption {
  display: inline-block;
  margin-right: 10px;
}

.box {
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-right: 3px;
}
.grey {
  background-color: darkgray;
}

.blue {
  background-color: rgb(21, 21, 143);
}

.light-blue {
  background-color: rgb(72, 126, 196);
}

.list-content {
  font-size: small;
}

.header-right-col {
  padding-top: 8px;
}

.image-icon {
  width: 30px;
  height: auto;
}

.shared {
  margin-left: 5px;
  margin-bottom: -10px;
}

.share {
  padding-left: 2px;
  padding-right: 2px;
  max-width: 18%;
}

.share-num {
  font-size: 16pt;
  font-weight: bold;
}

.btn-group-xs > .btn,
.btn-xs {
  padding: 0.25rem 0.4rem;
  font-size: 0.875rem;
  line-height: 0.5;
  border-radius: 0.2rem;
}
</style>