/* eslint-env browser */
/* global EventPublisher */

BubbleDiagram.BubbleView = function(params) {
    "use strict";

  var that = new EventPublisher(),
    selector;
  var transitionDelay = 1000;

  var temp = 0;

  function init() {
    selector = params.selector;
    return that;
  }

  function setAnswersWithCount(answersWithCount){
    //d3.selectAll("svg > *").remove(); // will haunt us later!

   var chartSVG = d3.select(selector)
   .attr("viewBox","0 0 960 960")
   .attr("perserveAspectRatio","xMinYMid")
   .selectAll("svg");

   //chartSVG.selectAll("*").remove();

   var bubbleNodes =  chartSVG.data(answersWithCount).enter().append("g");


   var rootNode = d3.hierarchy({children: answersWithCount})
   .sum(function(d) { return d.value; });

   d3.pack().padding(2).size([960,960])(rootNode);

   var rootNodeChildren = rootNode.children;
   console.log("temp = " + temp);
   if (temp == 0) {
     createBubbles(rootNodeChildren, bubbleNodes);
     addTextToBubbles(rootNodeChildren, bubbleNodes);
     temp = 1;
   } else {
     updateBubbles(rootNodeChildren);
     updateText(rootNodeChildren);
   }

 }


 function createBubbles(answersWithCount, bubbleNodes) {
   bubbleNodes.append("circle").data(answersWithCount)
   .style("fill", function() {
     return "rgb(62,206,255)";
   }).attr("r", function (d){
     console.log("d.r in create");
     console.log(d.r);
     return d.r;
   }).attr("cx", function(d){
     return d.x;
   }).attr("cy", function(d){
     return d.y;
   });
 }

 function addTextToBubbles(answersWithCount, bubbleNodes){
   console.log("bubbleNodes: " + bubbleNodes);
   bubbleNodes.append("text").data(answersWithCount)
   .text(function (d) {
     return d.data.key;
   }).attr("x", function(d){
     return d.x;
   }).attr("y", function(d){
     return d.y;
   }).style("text-anchor", "middle");
 }

 function updateBubbles (answersWithCount) {
   var circles = d3.selectAll(selector).selectAll("circle");
   console.log("circles");
   console.log(circles);
   //circles.remove();
    circles.data(answersWithCount)
     .transition()
     .duration(transitionDelay)
   .style("fill", function() {
     return "rgb(62,206,255)";
   }).attr("r", function (d){
     console.log("d.r in update");
     console.log(d.r);
     return d.r;
   }).attr("cx", function(d){
     return d.x;
   }).attr("cy", function(d){
     return d.y;
   });
 }

 function updateText (answersWithCount) {
   console.log(d3.selectAll(selector).selectAll("text"));
   d3.selectAll(selector).selectAll("text")
    .data(answersWithCount)
     .transition()
     .duration(transitionDelay)
     .attr("x", function(d){
     return d.x;
   }).attr("y", function(d){
     return d.y;
   }).style("text-anchor", "middle");

 }

that.init = init;
that.setAnswersWithCount = setAnswersWithCount;



return that;
};
