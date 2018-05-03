/* eslint-env browser */
/* global d3 */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette.StartDiagramManager = function (divEl, svgEl) {
    
    var that = {},
        width = 960,
        height = 500;
    
    function setupCsvData() {
        d3.csv("./data/flying-etiquette.csv", function(data) {
            createOuterRing(data.columns);
        });
    }
    
    function createOuterRing(data) {
        var radius = Math.min(width, height) / 2,
            color = d3.scaleOrdinal().range(["#18abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]),
            arc = d3.arc().outerRadius(radius - 10).innerRadius(radius - 70),
            pie = d3.pie().sort(null).value(function(d){return 1}),
            svg = d3.select(svgEl).attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
            g = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");
        
        g.append("path").attr("d", arc).style("fill", function(d){return color(d.data)});
        g.append("text").attr("transform", function(d){return "translate(" + arc.centroid(d) + ")"; }).attr("dy", ".35em").text(function(d){return d.data});
        
        
        console.log(data);
    }
    
    that.setupCsvData = setupCsvData;
    return that;
};