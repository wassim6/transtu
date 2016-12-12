/**
 * Created by Abbes on 10/06/2016.
 */
var Chart = function () {
    return {

        chartUser: function (data) {
            Chart.chartActiveByUser(data);
        },
        chartCoupon: function (data) {
            Chart.chartCouponByPro(data);
        },
        chartBusiness: function (data) {
            Chart.chartByRating(data);
            Chart.chartByCategory(data);
            Chart.chartByRegion(data);
        },

        chartCouponByPro : function (data) {
            $('#chart_1').highcharts({
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Historic World Population by Region'
                },
                subtitle: {
                    text: 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>'
                },
                xAxis: {
                    categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Population (millions)',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ' millions'
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Year 1800',
                    data: [107, 31, 635, 203, 2]
                }, {
                    name: 'Year 1900',
                    data: [133, 156, 947, 408, 6]
                }, {
                    name: 'Year 2012',
                    data: [1052, 954, 4250, 740, 38]
                }]
            });
        } ,

        chartActiveByUser: function (data) {
            Morris.Bar({
                element: 'chart_1',
                data: [
                    {y: '2006', a: 100},
                    {y: '2007', a: 75, b: 65},
                    {y: '2008', a: 50, b: 40},
                    {y: '2009', a: 75, b: 65},
                    {y: '2010', a: 50, b: 40},
                    {y: '2011', a: 75, b: 65},
                    {y: '2012', a: 100, b: 90}
                ],
                xkey: 'y',
                ykeys: ['a'],
                labels: ['Series A']
            });
        },
        chartByRating: function (data) {
            Morris.Bar({
                element: 'chart_1',
                data: [
                    {y: '2006', a: 100},
                    {y: '2007', a: 75, b: 65},
                    {y: '2008', a: 50, b: 40},
                    {y: '2009', a: 75, b: 65},
                    {y: '2010', a: 50, b: 40},
                    {y: '2011', a: 75, b: 65},
                    {y: '2012', a: 100, b: 90}
                ],
                xkey: 'y',
                ykeys: ['a'],
                labels: ['Series A']
            });
        },
        chartByRegion: function (data) {
            Morris.Bar({
                element: 'chart_2',
                data: [
                    {y: '2006', a: 100},
                    {y: '2007', a: 75, b: 65},
                    {y: '2008', a: 50, b: 40},
                    {y: '2009', a: 75, b: 65},
                    {y: '2010', a: 50, b: 40},
                    {y: '2011', a: 75, b: 65},
                    {y: '2012', a: 100, b: 90}
                ],
                xkey: 'y',
                ykeys: ['a'],
                labels: ['Series A']
            });
        },
        chartByCategory: function (data) {
            Morris.Bar({
                element: 'chart_3',
                data: [
                    {y: '2006', a: 100},
                    {y: '2007', a: 75, b: 65},
                    {y: '2008', a: 50, b: 40},
                    {y: '2009', a: 75, b: 65},
                    {y: '2010', a: 50, b: 40},
                    {y: '2011', a: 75, b: 65},
                    {y: '2012', a: 100, b: 90}
                ],
                xkey: 'y',
                ykeys: ['a'],
                labels: ['Series A']
            });
        }
    }
}();