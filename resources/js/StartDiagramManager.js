/* eslint-env browser */
/* global d3 */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette.StartDiagramManager = function (divEl, svgEl) {
    
    var that = {},
        width = 1500,
        height = 800,
        outerRingValue = 26,
        colorRange = ["#1565C0", "#B71C1C", "#C62828", "#EF6C00", "#6A1B9A", "#7B1FA2", "#8E24AA", "#00838F", "#9E9D24", "#AFB42B", "#D32F2F", "#E53935", "#F44336", "#0097A7", "#00ACC1", "#C0CA33", "#CDDC39", "#F57C00", "#FB8C00", "#1B5E20", "#2E7D32", "#1976D2", "#1E88E5", "#2196F3", "#42A5F5", "#64B5F6"];
    
    function setupStartDiagram() {
        var startDiagramModel = FlyingEtiquette.StartDiagramModel();
        
        startDiagramModel.setupCsvData();
        d3.csv("./data/flying-etiquette.csv", function() {
            createOuterRing(startDiagramModel.getOuterRingData());
            createInnerRing(startDiagramModel.getInnerRingData());
            createDots(startDiagramModel.getDotsData());
        });
    }
    
    //creates the outer ring of the start diagram, each segment has a specific color and represents one question from the data
    function createOuterRing(data) {
        var radius = Math.min(width, height) / 2,
            color = d3.scaleOrdinal().range(colorRange),
            arc = d3.arc().outerRadius(radius - 10).innerRadius(radius - 70),
            pie = d3.pie().sort(null).value(outerRingValue),
            svg = d3.select(svgEl).attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
            g = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc").attr("id", function(d, i){return "outerRing" + i});
        
        g.append("path")
            .attr("d", arc)
            .style("fill", function(d){return color(d.data)});
        //g.append("text").attr("transform", function(d){return "translate(" + arc.centroid(d) + ")"; }).attr("dy", ".35em").text(function(d){return d.data});
    }
    
    //creates the inner ring of the start diagram, each segment is separated by a white line and represents the amount of answers for one question from the data, the larger the amount of answers, the larger the segment gets 
    function createInnerRing(data) {
        var radius = Math.min(width/1.2, height/1.2) / 2,
            color = d3.scaleOrdinal().range(colorRange),
            arc = d3.arc().outerRadius(radius - 10).innerRadius(radius - 70),
            pie = d3.pie().sort(null).value(function(d){return d.value}),
            svg = d3.select(svgEl).attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
            g = svg.selectAll(".arc")
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", "arc")
                .attr("id", function(d, i){return "innerRing" + i});
        
        g.append("path")
            .attr("d", arc)
            .style("fill", function(d){return color(d.data["question"])})
            .style("stroke", "white")
            .style("stroke-width", "0.5px");
        //g.append("text").attr("transform", function(d){return "translate(" + arc.centroid(d) + ")"; }).attr("dy", ".35em").text(function(d){return d.data["question"]});
    }
    
    function createDots(dotdata) {
        var svg = d3.select(svgEl),
            bubbles = svg.append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                .selectAll(".bubble").data(dotdata)
                .enter();
        
        bubbles.append("circle").attr("r", "5")
            .style("fill", "#ff00ff")
            .attr("transform", function(d,i){return "translate(" + (i*10) + "," + 0 + ")"});
    }
    
    that.setupStartDiagram = setupStartDiagram;
    return that;
};