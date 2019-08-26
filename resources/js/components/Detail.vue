<template>
  <div class="row content">
    <div class="col-sm">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col">
              <h6>Detail harga udang</h6>
            </div>
            <div class="col header-right-col">
              <button class="btn btn-primary btn-xs float-right">SEMUA HARGA</button>
            </div>
          </div>
        </div>
        <div class="body content-detail">
          <div class="row">
            <div class="col">
              <div>{{ shrimpPricesDetail.date }}</div>
              <div>Panaeus vannamei</div>
              <h6 class="font-weight-bold text-primary">JAWA TIMUR</h6>
              <div>SITUBONDO</div>
            </div>
            <div class="col text-right">
              <div>Penjual:</div>
              <div>
                <i class="fas fa-check-circle"></i>
                {{ shrimpPricesDetail.creator.name }}
              </div>
              <button class="btn btn-outline-primary btn-xs">LIHAT KONTAK</button>
            </div>
          </div>
          <ul class="list-group list-group-flush" v-for="n in listSize" :key="n.index">
            <li class="list-group-item" v-if="n.price">
              <div class="row">
                <div class="col font-weight-bold">{{ n.name }}</div>
                <div
                  class="col"
                >Rp {{ n.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</div>
              </div>
            </li>
          </ul>
          <div class="row catatan">
            <div class="col font-weight-bold">Catatan</div>
            <div class="col">
              Ada perbedaan harga di size 50 - 58, size 46 - 49, size 30 - 45
              <br />Harga berlaku untuk biomass udang 1 ton
              <br />Apabila biomass udang lebih dari 10 ton akan berbeda harga
            </div>
          </div>
          <div class="detail-footer">
            <span class="detail-list-icon">25 Share</span>
            <span class="detail-list-icon">
              <img src="../assets/icons/whatsapp.svg" class="image-icon" alt="whatsapp" />
            </span>
            <span class="detail-list-icon">
              <img src="../assets/icons/facebook.svg" class="image-icon" alt="facebook" />
            </span>
            <span class="detail-list-icon">
              <img src="../assets/icons/twitter.svg" class="image-icon" alt="twitter" />
            </span>
            <span class="detail-list-icon">
              <img src="../assets/icons/messenger.svg" class="image-icon" alt="messenger" />
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-sm">
      <h6>Rekomendasi</h6>
      <hr />
      <div v-for="n in shrimpPrices" :key="n.id">
        <div class="card recommendation">
          <div class="card-body">
            <div class="row">
              <div class="col">
                <div>{{ n.date }} / Dibuat Oleh Petambak / {{ n.creator.name }}</div>
                <h6 class="font-weight-bold text-primary">{{ n.region.province_name }}</h6>
                <div class="text-primary">{{ n.region.regency_name }}</div>
                <div>{{ n.species.name }}</div>
                <div>Harga Size 100 :</div>
                <h4>Rp {{ n.size_100.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</h4>
              </div>
              <div class="col text-right">
                <div>Penjual:</div>
                <div>{{ n.creator.name }}</div>
                <button class="btn btn-outline-primary btn-xs">LIHAT KONTAK</button>
              </div>
            </div>
            <router-link
              class="btn btn-primary btn-sm btn-block"
              :to="{name: 'Detail', params: { id: n.id}}"
            >SEMUA SIZE</router-link>
            <div class="text-center footer-icon">
              <span>25 Share</span>
              <span class>
                <img src="../assets/icons/whatsapp.svg" class="image-icon" alt="whatsapp" />
              </span>
              <span>
                <img src="../assets/icons/facebook.svg" class="image-icon" alt="facebook" />
              </span>
              <span>
                <img src="../assets/icons/twitter.svg" class="image-icon" alt="twitter" />
              </span>
              <span>
                <img src="../assets/icons/messenger.svg" class="image-icon" alt="messenger" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../api";
export default {
  data() {
    return {
      shrimpPricesDetail: "",
      shrimpPrices: [],
      listSize: [],
      filter: {
        search: "",
        with: "creator,species,region",
        sort: "size_100|creator.name,desc",
        region_id: ""
      }
    };
  },
  methods: {
    shrimpDetail(id) {
      Api.shrimp_prices
        .find(id)
        .then(res => {
          const params = {
            search: this.filter.search,
            with: this.filter.with,
            sort: this.filter.sort,
            region_id: this.filter.region_id
          };
          Api.shrimp_prices
            .filter(params)
            .then(resp => {
              this.shrimpPrices = resp.data.data;
            })
            .catch(error => {
              throw error;
              alert(error);
            });
          this.shrimpPricesDetail = res.data.data;
          for (let key in res.data.data) {
            /^size_\d+$/.test(key)
              ? this.listSize.push({ name: key, price: res.data.data[key] })
              : null;
          }
        })
        .catch(err => {
          throw err;
          alert(err);
        });
    }
  },
  mounted() {
    var self = this;
    var id = this.$route.params.id;
    self.shrimpDetail(id);
  }
};
</script>
<style>
.content {
  margin-top: 15px;
}

.content-detail {
  padding: 15px 20px 15px 20px;
  font-size: small;
}

.catatan {
  margin-left: 0px;
}

.detail-footer {
  margin-top: 25px;
  margin-left: 25px;
}

.detail-list-icon {
  margin-right: 5px;
}

.recommendation {
  margin-bottom: 20px;
  font-size: small;
}
.footer-icon {
  margin-top: 15px;
}
</style>