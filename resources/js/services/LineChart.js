import {
    Line
} from 'vue-chartjs';

export default {
    extends: Line,
    props: {
        datesPrice: {
            type: Array,
            required: true,
        },
        datesDate: {
            type: Array,
            required: true,
            default: null
        }
    },
    watch: {
        datesDate(val) {
            val !== null ? this.renderChart(this.datacollection, this.options) : null
        }
    },
    data() {
        return {
            datacollection: {
                //Data to be represented on x-axis
                labels: this.datesDate,
                datasets: [{
                    label: 'Size 100',
                    backgroundColor: '#90caf9',
                    pointBackgroundColor: 'white',
                    borderWidth: 1,
                    pointBorderColor: '#0d47a1',
                    //Data to be represented on y-axis
                    data: this.datesPrice
                }]
            },
            //Chart.js options that controls the appearance of the chart
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        gridLines: {
                            display: true
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        }
                    }]
                },
                legend: {
                    display: true
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    }
}
