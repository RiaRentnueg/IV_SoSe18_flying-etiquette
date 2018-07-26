/* eslint-env browser */
/* global d3 */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette.StartDiagramManager = function (divEl, svgEl) {
    
    var that = {},
        width = 1000,
        height = 800,
        outerRingValue = 26,
        colorRange = ["#1565C0", "#B71C1C", "#C62828", "#EF6C00", "#6A1B9A", "#7B1FA2", "#8E24AA", "#00838F", "#9E9D24", "#AFB42B", "#D32F2F", "#E53935", "#F44336", "#0097A7", "#00ACC1", "#C0CA33", "#CDDC39", "#F57C00", "#FB8C00", "#1B5E20", "#2E7D32", "#1976D2", "#1E88E5", "#2196F3", "#42A5F5", "#64B5F6"];
    
    function setupStartDiagram() {
        var startDiagramModel = FlyingEtiquette.StartDiagramModel(),
            controller = FlyingEtiquette.StartDiagramController();
        
        startDiagramModel.setupCsvData();
        d3.csv("./data/flying-etiquette.csv", function() {
            createOuterRing(startDiagramModel.getOuterRingData());
            createInnerRing(startDiagramModel.getInnerRingData());
            createDots(startDiagramModel.getProcessedDotsData());
            
            controller.setupEventListeners();
        });
        
    }
    
    //creates the outer ring of the start diagram, each segment has a specific color and represents one question from the data
    function createOuterRing(data) {
        var radius = Math.min(width, height) / 2,
            color = d3.scaleOrdinal().range(colorRange),
            arc = d3.arc().outerRadius(radius - 10).innerRadius(radius - 70),
            pie = d3.pie().sort(null).value(outerRingValue),
            svg = d3.select(svgEl).attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
            g = svg.selectAll(".arc").data(pie(data))
                .enter()
                .append("g")
                .attr("class", "arc outer");
        
        g.append("path")
            .attr("d", arc)
            .style("fill", function(d){return color(d.data)});
        
    }
    
    //creates the inner ring of the start diagram, each segment is separated by a white line and represents the amount of answers for one question from the data, the larger the amount of answers, the larger the segment gets 
    function createInnerRing(data) {
        var radius = Math.min(width/1.2, height/1.2) / 2,
            color = d3.scaleOrdinal().range(colorRange),
            arc = d3.arc().outerRadius(radius - 10).innerRadius(radius - 70),
            pie = d3.pie().sort(null).value(function(d){return d.value}),
            zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", zoomed),
            svg = d3.select(svgEl).attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
            container = svg.append("g"),
            g = container.selectAll(".arc")
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", "arc inner");
        
        g.append("path")
            .attr("d", arc)
            .style("fill", function(d){return color(d.data["question"])})
            .style("stroke", "white")
            .style("stroke-width", "0.2px");
        
        svg.call(zoom);
        
        
        function zoomed() {
            container.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ")scale(" + d3.event.transform.k + "," + d3.event.transform.k + ")");
        }
    }
    
    function createDots(proccessedDots) {
        var svg = d3.select(svgEl).selectAll("svg"),
            bubbles = svg.data(proccessedDots),
            nodes,
            packObj,
            hierarchyObj,
            bubbleChart,
            dots;
        
        //move function into the Model to add information about the answers given by the participant, this could be necessary to test if people gave the same answer, in which case the dots would light up accordingly
        /*for (let i = 0; i < dotdata.length; i++){
            dataValue = dotdata[i]["RespondentID"];
            dataArray[i] = {value: dataValue};
        }*/
        
        nodes = {children: proccessedDots};
        
        packObj = d3.pack().size([500, 500]);
        
        hierarchyObj = d3.hierarchy(nodes).sum(function(d) {return d.value;}).sort(function(a,b) {return b.value - a.value;});
        
        bubbleChart = bubbles.data(packObj(hierarchyObj).descendants()).enter().append("g");
        
        bubbleChart.append("circle")
            .style("fill", "rgb(0,80,250)")
            .attr("r", function(d) {return d.r;})
            .attr("cx", function (d) {return d.x;})
            .attr("cy", function(d) {return d.y;})
            .attr("transform", "translate(" + width / 4 + "," + height / 5.25 + ")")
            .attr("class", "participantDots");
        
        dots = document.querySelectorAll(".participantDots");
        dots[0].style = ("fill: #000000");
        
    }
    
    that.setupStartDiagram = setupStartDiagram;
    return that;
};