import Axios from 'axios'
import path from '../constants/api'

Axios.defaults.baseURL = 'http://localhost:8000'
Axios.defaults.headers.post['Content-Type'] = 'application/json'
Axios.defaults.headers.post['Accept'] = 'application/json'

const api = {
    shrimp_prices: {
        filter: (params) => {
            return Axios.get(path.shrimp_prices, {
                params: params
            })
        },
        find: (id) => {
            return Axios.get(path.shrimp_prices_detail.replace('{id}', id))
        },
        price: () => {
            return Axios.get(path.prices)
        }
    },
    auth: {
        login: (user) => {
            return Axios.post(path.auth.login, user, {
                params: {}
            })
        },
        logout: () => {
            return Axios.get(path.auth.logout)
        },
        register: (data) => {
            return Axios.post(path.auth.register, data)
        }
    }
}

export default api
