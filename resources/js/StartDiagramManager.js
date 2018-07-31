/* eslint-env browser */
/* global d3 */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette.StartDiagramManager = function (divEl, svgEl) {
    
    var that = {},
        width = 1000,
        height = 800,
        outerRingValue = 26,
        colorRange = ["#1565C0", "#B71C1C", "#C62828", "#EF6C00", "#6A1B9A", "#7B1FA2", "#8E24AA", "#00838F", "#9E9D24", "#AFB42B", "#D32F2F", "#E53935", "#F44336", "#0097A7", "#00ACC1", "#C0CA33", "#CDDC39", "#F57C00", "#FB8C00", "#1B5E20", "#2E7D32", "#1976D2", "#1E88E5", "#2196F3", "#42A5F5", "#64B5F6"];
    
    //setup the model, controller and the visual reprensation of the start diagram, connect the data from the model with the outer ring, inner ring and the dots, then setup the controller after that to handle resulting events
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
            svg = d3.select(svgEl).attr("viewBox", "0,0," + width + "," + height).attr("preserveAspectRatio", "xMinYMid").append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
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
            svg = d3.select(svgEl).attr("viewBox", "0,0," + width + "," + height).attr("preserveAspectRatio", "xMinYMid")
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
        
        //implement the zoom functionaliy for the inner ring, which can also be moved to allow the ring to return to the start position with the help of the user
        function zoomed() {
            container.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ")scale(" + d3.event.transform.k + "," + d3.event.transform.k + ")");
        }
    }
    
    //create one dot for every participant in the dataset, one dot has every answer given by the participant for the study
    function createDots(proccessedDots) {
        var svg = d3.select(svgEl).selectAll("svg"),
            bubbles = svg.data(proccessedDots),
            nodes = {children: proccessedDots},
            packObj = d3.pack().size([500, 500]),
            hierarchyObj = d3.hierarchy(nodes).sum(function(d) {return d.value;}).sort(function(a,b) {return b.value - a.value;}),
            bubbleChart = bubbles.data(packObj(hierarchyObj).descendants()).enter().append("g"),
            dots;
        
        bubbleChart.append("circle")
            .style("fill", "rgb(0,80,250)")
            .attr("r", function(d) {return d.r;})
            .attr("cx", function (d) {return d.x;})
            .attr("cy", function(d) {return d.y;})
            .attr("transform", "translate(" + width / 4 + "," + height / 5.25 + ")")
            .attr("class", "participantDots");
        
        dots = document.querySelectorAll(".participantDots");
        //color the dot that entails every other dot with a different color to set a background-color for all dots
        dots[0].style.fill = "#000000"; 
    }
    
    //changes the color of an inner ring segment to highlight it
    function colorActiveSegment(element) {
        element.style.fill = "rgb(0,0,80)";
    }
    
    //changes the color of a dot to highlight it
    function colorActiveDot(element) {
        element.style.fill = "rgb(0,80,250)";
    }
    
    //changes the color of a dot to show that it is not highlighted
    function colorInactiveDot(element) {
        element.style.fill = "rgb(20,20,100)";
    }
    
    //sets the text that appears inside the info box when the user hovers over an outer ring segment
    function setOuterRingHoverText(element, event) {
        element.innerHTML = "<br>" + event.target["__data__"]["data"];
    }
    
    //removes the text that appears inside the info box when the user exits an outer ring segment
    function removeOuterRingHoverText(element) {
        element.innerHTML = "";
    }
    
    //sets the text that appears inside the info box when the user hovers over an inner ring segment (the text includes the corresponding question and the percentage that the selected answer was given)
    function setInnerRingHoverText(innerRingText, outerRingText, event) {
        innerRingText.innerHTML = "<br>" + event.target["__data__"]["data"]["answer"] + " <br> (" + (event.target["__data__"]["data"]["value"] / 856 * 100).toFixed(2) + "%)";
        outerRingText.innerHTML = "<br>" + event.target["__data__"]["data"]["question"];
    }
    
    //removes the text that appears inside the info box when the user exits an inner ring segment
    function removeInnerRingHoverText(innerRingText, outerRingText) {
        innerRingText.innerHTML = "";
        outerRingText.innerHTML = "";
    }
    
    //reassign the colors saved in colorRange for the inner ring segments
    function reassignRingColor(element, counter) {
        element.children[0].style.fill = colorRange[counter];
    }
    
    that.setupStartDiagram = setupStartDiagram;
    that.colorActiveSegment = colorActiveSegment;
    that.colorActiveDot = colorActiveDot;
    that.colorInactiveDot = colorInactiveDot;
    that.setOuterRingHoverText = setOuterRingHoverText;
    that.removeOuterRingHoverText = removeOuterRingHoverText;
    that.setInnerRingHoverText = setInnerRingHoverText;
    that.removeInnerRingHoverText = removeInnerRingHoverText;
    that.reassignRingColor = reassignRingColor;
    return that;
};