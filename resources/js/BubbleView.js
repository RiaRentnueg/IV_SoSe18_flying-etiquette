/* eslint-env browser */
/* global EventPublisher */

BubbleDiagram.BubbleView = function(params) {
    "use strict";

  var that = new EventPublisher(),
    bubbleSvg;
  var transitionDelay = 1000;
  var initialPackSize = 960;
  var diagramShift;



  function init() {
    bubbleSvg = params.bubbleSvg;
    return that;
  }

  function setAnswersWithCount(answersWithCount){
   //var chartSVG = d3.select(selector)
   var chartSVG = bubbleSvg
   .attr("viewBox","0 0 960 960")
   .attr("preserveAspectRatio","xMinYMid")
   .selectAll("svg");

   //chartSVG.data(answersWithCount).enter().append("g").exit().remove();

  // var bubbleNodes = d3.selectAll(selector);//.select("g");
   var rootNode = d3.hierarchy({children: answersWithCount})
   .sum(
     function(d) { return d.value;});

   //.sort(function(a, b) { return b.value - a.value; });

   //calculates size of pack layout (needed that bubbles shrink proportionally)
   var currentPackSize = rootNode.value;//* tpCount;

   d3.pack().padding(2).size([currentPackSize,currentPackSize])(rootNode);



   var rootNodeChildren = rootNode.children;

   updateBubbles(rootNodeChildren, bubbleSvg);
   updateText(rootNodeChildren, bubbleSvg);
 }



 function createBubbles (circles) {
   var baseColor = (Math.random() * 360);
   circles.enter().append("circle")
    .style("fill", function(d) {
       return "hsl(" + (baseColor ) + ",100%,"+(30+ (d.parent.children.indexOf(d) * 20))+"%)";
     })
    .call(setUpCircle);
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
   selection.attr("x", function(d){
   var diagramShift = (856 - d.parent.value)/2;
   return d.x + diagramShift;
 }).attr("y", function(d){
   var diagramShift = (856 - d.parent.value)/2;
   return d.y + diagramShift;
 }).style("text-anchor", "middle");
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
