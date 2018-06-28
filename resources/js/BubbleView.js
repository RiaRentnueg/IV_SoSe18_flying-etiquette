/* eslint-env browser */
/* global EventPublisher */

BubbleDiagram.BubbleView = function(params) {
    "use strict";

  var that = new EventPublisher(),
    bubbleSvg,
    legendSvg;
  var colorObj = {}, dataArr = [], xDataCircle = [], yDataCircle = [], xDataText = [], yDataText = [],
  transitionDelay = 1000,
  initialPackSize = 960,
  diagramShift;



  function init() {
    bubbleSvg = params.bubbleSvg;
    legendSvg = params.legendSvg;
    return that;
  }

  function setAnswersWithCount(answersWithCount){
   //var chartSVG = d3.select(selector)
   var chartSVG = bubbleSvg
   .attr("viewBox","0 0 960 960")
   .attr("preserveAspectRatio","xMinYMid")
   .selectAll("svg");

   var rootNode = d3.hierarchy({children: answersWithCount})
   .sum(
     function(d) { return d.value;});

   var currentPackSize = rootNode.value;//* tpCount;

   d3.pack().padding(2).size([currentPackSize,currentPackSize])(rootNode);

   var rootNodeChildren = rootNode.children;

   updateBubbles(rootNodeChildren, bubbleSvg);
   updateText(rootNodeChildren, bubbleSvg);
   updateLegend(legendSvg);
   updateLines(rootNodeChildren, bubbleSvg);
  // appendLines(answersWithCount);
 }

 function updateLegend (legendSvg) {
   var legendChart = legendSvg
   .attr("viewBox","0 0 960 960")
   .attr("preserveAspectRatio","xMinYMid")
   .selectAll("svg");

    var circles = legendSvg.selectAll("circle").data(dataArr);
    var circle = circles.enter().append("circle");

   circle.style("fill", function(d) {
     return d.data.value;
   }).call(setUpLegend);

 }

 function setUpLegend (selection) {
  selection.attr("r", 100)
   .attr("cx", function(d, i) {
     return 200;
   })
   .attr("cy", function (d, i) {
     return 220*i+200;
   });

   var texts = legendSvg.selectAll("text").data(dataArr);

   texts.exit().remove();
   texts.enter().append("text")
   .text(function (d) {
     return d.data.key.data.key;
   }).attr("x", function(d){
   return 500;
 }).attr("y", function(d,i){
   return 220*i+200;
 }).style("font-size", "75px");


 }


 function createBubbles (circles) {

   var baseColor = (Math.random() * 360);
   var circle = circles.enter().append("circle");
    circle.style("fill", function(d) {
       var color;
       color = "hsl(" + (baseColor ) + ",100%,"+(30+ (d.parent.children.indexOf(d) * 20))+"%)";

       var obj = {key: d, value: color};
       dataArr.push(obj);




       return color;
     });
     var rootNode = d3.hierarchy({children: dataArr})
     .sum(
       function(d) { return d.value;});

     var currentPackSize = rootNode.value;//* tpCount;

     d3.pack().padding(2).size([currentPackSize,currentPackSize])(rootNode);

     dataArr = rootNode.children;
   colorObj = {name: "legendArray", size: dataArr.length, children: dataArr};
    circle.call(setUpCircle);
  }

  function updateBubbles (answersWithCount, bubbleSvg) {

    var dataObj = {name: "bubbleArray", size: 856, children: answersWithCount};
    var circles = bubbleSvg.selectAll("circle").data(answersWithCount);
    circles.exit().remove();
    createBubbles(circles);
    circles.transition()
      .duration(transitionDelay)
      .call(setUpCircle);
   }

 function setUpCircle(selection) {
   selection.attr("r", function (d){
     return d.r;
   }).attr("cx", function(d){
     var diagramShift = (856 - d.parent.value)/2;
     return d.x + diagramShift;
   }).attr("cy", function(d, diagramShift){
     var diagramShift = (856 - d.parent.value)/2;
     return d.y + diagramShift;
   });
 }

 function addText(texts){
   texts.enter().append("text")
   .text(function (d) {
     return d.data.key;
   }).call(setUpText);
  }

 function setUpText(selection) {

console.log("UPDATING TEXT");
  let texts = selection.attr("x", function(d,i){

   var diagramShift = (856 - d.parent.value)/2;
   xDataCircle.push(d.x + diagramShift);
   xDataText.push(300+i*200);
   return 300+i*200;
 }).attr("y", function(d){

   var diagramShift = (856 - d.parent.value)/2;
    yDataCircle.push(d.y + diagramShift);
    yDataText.push(30);
   return 30;
 }).style("text-anchor", "middle").style("font-size", "20px").attr("class",'labelBox');






 }



 function updateLines(answersWithCount, bubbleSvg) {

  var lines =  bubbleSvg.selectAll("line").data(answersWithCount);
  lines.exit().remove();
  createLines(lines);
  lines.transition()
    .duration(transitionDelay)
    .call(setUpLine);
 }

 function createLines (lines) {
   var line = lines.enter().append("line");
   line.call(setUpLine);
  }



 function setUpLine(selection) {
   console.log(selection);
      console.log("UPDATING LINES");

   selection.attr("x1", function(d,i){
         console.log("HALLO IM X1 LINE");
    return 300+i*200;
  }).attr("y1", function(d){
        console.log("HALLO IM Y1 LINE");
    return 40;
  }).attr("x2", function(d,i){
    console.log("HALLO IM X2 LINE");
   var diagramShift = (856 - d.parent.value)/2;
   return d.x + diagramShift;
 }).attr("y2", function(d){
   console.log("HALLO IM Y1 LINE");
    var diagramShift = (856 - d.parent.value)/2;
    return d.y + diagramShift;
 }).style("stroke", function(d) {
   console.log("in der Farbe bin ich drin");
   return 'black';
 })  // colour the line
 .style("stroke-width", 1);
  //.style("text-anchor", "middle").style("font-size", "20px").attr("class",'labelBox');

 }

 function updateText (answersWithCount, bubbleSvg) {

   var texts = bubbleSvg.selectAll("text").data(answersWithCount);

   texts.exit().remove();
   addText(texts);

   texts.transition()
     .duration(transitionDelay)
     .call(setUpText);
  }

that.init = init;
that.setAnswersWithCount = setAnswersWithCount;

return that;
};
