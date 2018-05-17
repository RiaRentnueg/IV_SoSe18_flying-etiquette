/* eslint-env browser */
/* global d3 */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette.StartDiagramManager = function (divEl, svgEl) {
    
    var that = {},
        width = 1500,
        height = 800,
        outerRingValue = 26,
        tempData = [],
        currData = [],
        container = {};
    
    function setupCsvData() {
        d3.csv("./data/flying-etiquette.csv", function(data) {
            createOuterRing(data.columns);
            for(let i = 1; i < data.columns.length; i++){
                for(let j = 0; j < data.length; j++){
                    tempData.push(data[j][data.columns[i]]);
                }
                countArrayElements(tempData, data.columns[i]);
                tempData = [];
            }
            createInnerRing(currData);
        });
    }
    
    function countArrayElements(array, questionName) {
        var current = null,
            count = 0;
        
        array.sort();
        for(let i = 0; i < array.length; i++) {
            if (array[i] != current) {
                if (count > 0) {
                    setupContainer(questionName, current, count);
                }
                current = array[i];
                count = 1;
            } else {
                count++;
            }
        }
        if (count > 0) {
            setupContainer(questionName, current, count);
        }
    }
    
    function setupContainer(question, answer, value) {
        container.question = question;
        container.answer = answer;
        container.value = value;
        currData.push(container);
        container = {};
    }
    
    function createOuterRing(data) {
        var radius = Math.min(width, height) / 2,
            color = d3.scaleOrdinal().range(["#1565C0", "#B71C1C", "#C62828", "#EF6C00", "#6A1B9A", "#7B1FA2", "#8E24AA", "#00838F", "#9E9D24", "#AFB42B", "#D32F2F", "#E53935", "#F44336", "#0097A7", "#00ACC1", "#C0CA33", "#CDDC39", "#F57C00", "#FB8C00", "#1B5E20", "#2E7D32", "#1976D2", "#1E88E5", "#2196F3", "#42A5F5", "#64B5F6"]),
            arc = d3.arc().outerRadius(radius - 10).innerRadius(radius - 70),
            pie = d3.pie().sort(null).value(outerRingValue),
            svg = d3.select(svgEl).attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
            g = svg.selectAll(".arc").data(pie(data.slice(1,data.length))).enter().append("g").attr("class", "arc").attr("id", function(d, i){return "outerRing" + i});
        
        g.append("path").attr("d", arc).style("fill", function(d){return color(d.data)});
        //g.append("text").attr("transform", function(d){return "translate(" + arc.centroid(d) + ")"; }).attr("dy", ".35em").text(function(d){return d.data});
    }
    
    function createInnerRing(data) {
        var radius = Math.min(width/1.2, height/1.2) / 2,
            color = d3.scaleOrdinal().range(["#1565C0", "#B71C1C", "#EF6C00", "#6A1B9A", "#00838F", "#9E9D24", "#1B5E20"]),
            arc = d3.arc().outerRadius(radius - 10).innerRadius(radius - 70),
            pie = d3.pie().sort(null).value(function(d){return d.value}),
            svg = d3.select(svgEl).attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
            g = svg.selectAll(".arc").data(pie(data.slice(1,data.length))).enter().append("g").attr("class", "arc").attr("id", function(d, i){return "innerRing" + i});
        
        g.append("path").attr("d", arc).style("fill", function(d){return color(d.value)});
    }
    
    that.setupCsvData = setupCsvData;
    return that;
};