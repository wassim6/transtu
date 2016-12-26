'use strict';

MetronicApp.controller('DashboardCtrl', function ($scope, $timeout, AccidentService, DashbordService) {


    AccidentService.StatAccident().get({}, function (res) {
        var result = res.data;
        stat(null, result);
    });
    function stat(err, result) {

        var data, dimensions, monthNames, dayOfWeekNames, timeIntervals,
            baseLayer, clusterLayer, map, updateActiveSectionFilters,
            redraw, chartColor, charts, rowChartHeight;

        // Hide loader and show map.
        $("#loader").hide();
        // leaflet doesn't work with display: none
        $("#mainframe").css("visibility", "visible");
        // visibility: hidden on mainframe doesn't reach collapse
        $(".collapse.in").css("visibility", "visible");

        // Filter out accidents without location. Socrata doesn't seem
        // to understand `$where=coordinates IS NOT NULL`.
        result = result.filter(function (trafficAccident) {
            return trafficAccident.hasOwnProperty("coordinates");
        });

        // Add data to Crossfilter.
        data = crossfilter(result);

        // Create dimensions (charts and dimensions share the same name).
        dimensions = {};

        dimensions.coordinates = data.dimension(function (record) {
            return [record.coordinates.latitude, record.coordinates.longitude];
        });

        dimensions.year = data.dimension(function (record) {
            var date;
            date = new Date(record.crash_date);
            return date.getFullYear();
        });

        monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        dimensions.month = data.dimension(function (record) {
            var date;
            date = new Date(record.crash_date);
            return date.getMonth();
        });

        dimensions.day = data.dimension(function (record) {
            var date;
            date = new Date(record.crash_date);
            return date.getDate();
        });

        dayOfWeekNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        dimensions.dayOfWeek = data.dimension(function (record) {
            // Reformat for sorting.
            return dayOfWeekNames.indexOf(record.day_of_week);
        });

        timeIntervals = ["00h00 => 00h59", "01h00 => 01h59", "02h00 => 02h59", "03h00 => 03h59", "04h00 => 04h59"
            , "05h00 => 05h59", "06h00 => 06h59", "07h00 => 07h59", "08h00 => 08h59", "09h00 => 09h59"
            , "10h00 => 10h59", "11h00 => 11h59", "12h00 => 12h59", "13h00 => 13h59", "14h00 => 14h59"
            , "15h00 => 15h59", "16h00 => 16h59", "17h00 => 17h59", "18h00 => 18h59", "19h00 => 19h59"
            , "20h00 => 20h59", "21h00 => 21h59", "22h00 => 22h59", "23h00 => 23h59"
        ];
        dimensions.time = data.dimension(function (record) {
            return timeIntervals.indexOf(record.time);
        });


        // Prepare map.
        baseLayer = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/normal.day/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
            attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
            subdomains: '1234',
            mapID: 'newest',
            app_id: 'oBrjPtnB5CZNkvOVmmqw',
            app_code: 'TPBtO9fTES--LhkVo5sKeA',
            base: 'base',
            minZoom: 0,
            maxZoom: 20
        });

        clusterLayer = L.markerClusterGroup({
            singleMarkerMode: true
        });

        map = L.map("map", {
            center: L.latLng(37.1588544, 9.776710900000012),
            zoom: 7,
            layers: [baseLayer, clusterLayer]
        });

        updateActiveSectionFilters = function () {
            $(".active-filters").each(function () {
                var filters, sectionCharts, chartLabels;
                filters = [];
                sectionCharts = $(".reset", $(this).parents(".panel")).map(function () {
                    return {
                        chart: $(this).data("chart"),
                        label: $(this).prev().text()
                    };
                }).get();
                sectionCharts.forEach(function (sectionChart) {
                    var chart;
                    chart = charts[sectionChart.chart];
                    if (chart !== undefined && chart.hasFilter() === true) {
                        filters.push(sectionChart.label + ": " + chart.filters().join(", "));
                    }
                });
                if (filters.length > 0) {
                    $(this).html(" | " + filters.join("; "));
                } else {
                    $(this).html("");
                }
            });
        };

        redraw = function () {
            clusterLayer.clearLayers();
            dimensions.coordinates.top(Infinity).forEach(function (record) {
                var mark;
                mark = L.marker([record.coordinates.latitude, record.coordinates.longitude]);
                clusterLayer.addLayer(mark);
            });
        };

        // Prepare charts (charts and dimensions share the same name).
        charts = {};
        chartColor = d3.scale.ordinal().range(["#44afe1"]);
        rowChartHeight = 28;

        charts.year = dc.pieChart("#year-selector");
        charts.year.dimension(dimensions.year)
            .group(dimensions.year.group())
            .colors(chartColor)
            .on("filtered", function () {
                updateActiveSectionFilters();
                redraw();
            });

        charts.month = dc.rowChart("#month-selector");
        charts.month.height(dimensions.month.group().size() * rowChartHeight)
            .dimension(dimensions.month)
            .group(dimensions.month.group())
            .elasticX(true)
            .label(function (d) {
                return monthNames[d.key].substr(0, 3);
            })
            .title(function (d) {
                return monthNames[d.key] + ": " + d.value;
            })
            .colors(chartColor)
            .margins({
                top: 0,
                left: 5,
                bottom: 30,
                right: 10
            })
            .on("filtered", function () {
                updateActiveSectionFilters();
                redraw();
            });
        charts.month.xAxis().ticks(4);

        charts.day = dc.rowChart("#day-selector");
        charts.day.height(dimensions.day.group().size() * rowChartHeight)
            .dimension(dimensions.day)
            .group(dimensions.day.group())
            .elasticX(true)
            .title(function (d) {
                return "Day " + d.key + ": " + d.value;
            })
            .colors(chartColor)
            .margins({
                top: 0,
                left: 5,
                bottom: 30,
                right: 10
            })
            .on("filtered", function () {
                updateActiveSectionFilters();
                redraw();
            });
        charts.day.xAxis().ticks(4);

        charts.dayOfWeek = dc.rowChart("#day-of-week-selector");
        charts.dayOfWeek.height(dimensions.dayOfWeek.group().size() * rowChartHeight)
            .dimension(dimensions.dayOfWeek)
            .group(dimensions.dayOfWeek.group())
            .elasticX(true)
            .label(function (d) {
                return dayOfWeekNames[d.key].substr(0, 3);
            })
            .title(function (d) {
                return dayOfWeekNames[d.key] + ": " + d.value;
            })
            .colors(chartColor)
            .margins({
                top: 0,
                left: 5,
                bottom: 30,
                right: 10
            })
            .on("filtered", function () {
                updateActiveSectionFilters();
                redraw();
            });
        charts.dayOfWeek.xAxis().ticks(4);

        charts.time = dc.rowChart("#time-selector");
        charts.time.height(dimensions.time.group().size() * rowChartHeight)
            .dimension(dimensions.time)
            .group(dimensions.time.group())
            .elasticX(true)
            .label(function (d) {
                if (d.key >= 0) {
                    return timeIntervals[d.key];
                } else {
                    return "Unknown";
                }
            })
            .title(function (d) {
                var label;
                if (d.key >= 0) {
                    label = timeIntervals[d.key];
                } else {
                    label = "Unknown";
                }
                return label + ": " + d.value;
            })
            .colors(chartColor)
            .margins({
                top: 0,
                left: 5,
                bottom: 30,
                right: 10
            })
            .on("filtered", function () {
                updateActiveSectionFilters();
                redraw();
            });
        charts.time.xAxis().ticks(4);


        // Prepare reset buttons.
        $(".chart a").on("click", function () {
            var chart;
            chart = $(this).data("chart");
            charts[chart].filterAll();
            dc.redrawAll();
        });

        // Start with 2014 because clustering markers is slow.
        //charts.year.filter(2014);

        redraw();
        dc.renderAll();

    };
    
    DashbordService.DashbordStat().get({}, function (res) {
        $scope.countAccident = res.countAccident;
        $scope.countUser = res.countUser;
        $scope.accidents20 = res.accidents20;
        $scope.users20 = res.users20;
    });

    DashbordService.DashbordDegat().get({}, function (res) {
        $scope.totalAccident = res.totalAccident;
        $scope.percentDegatCorporel =  Math.trunc((res.degatCorporel/$scope.totalAccident) *100);
        $scope.percentDegatPhysique = Math.trunc((res.degatPhysique/$scope.totalAccident) *100);
        $scope.percentSansDegat = Math.trunc((res.sansDegat/$scope.totalAccident) *100);
    });

    DashbordService.NotificationNavbar().get({}, function (res) {
        $scope.notification5 = res.notification5;
        $scope.notificationNotRead = res.notificationNotRead;
    });

    $scope.sansDegat = {barColor:'#3b9c96', lineWidth:5};
    $scope.degatPhysique = {barColor:'#daae2b', lineWidth:5};
    $scope.degatCorporel = {barColor:'#E67E22', lineWidth:5};


});