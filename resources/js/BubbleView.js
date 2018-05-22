/* eslint-env browser */
/* global EventPublisher */

BubbleDiagram.BubbleView = function(params) {
    "use strict";

  var that = new EventPublisher(),
    selector;


  function init() {
    selector = params.selector;
    return that;
  }

  function setAnswersWithCount(answersWithCount){
   var chartSVG = d3.select(selector)
   .attr("viewBox","0 0 960 960")
   .attr("perserveAspectRatio","xMinYMid")
   .selectAll("svg");

   var bubbleNodes =  chartSVG.data(answersWithCount).enter().append("g");

   var rootNode = d3.hierarchy({children: answersWithCount})
   .sum(function(d) { return d.value; });

   d3.pack().padding(2).size([960,960])(rootNode);

   var rootNodeChildren = rootNode.children;

   createBubbles(rootNodeChildren, bubbleNodes);
   addTextToBubbles(rootNodeChildren, bubbleNodes);
 }


 function createBubbles(answersWithCount, bubbleNodes) {
   bubbleNodes.append("circle").data(answersWithCount)
   .style("fill", function() {
     return "rgb(62,206,255)";
   }).style("r", function (d){
     return d.r;
   }).attr("cx", function(d){
     return d.x;
   }).attr("cy", function(d){
     return d.y;
   });
 }

 function addTextToBubbles(answersWithCount, bubbleNodes){
   bubbleNodes.append("text").data(answersWithCount)
   .text(function (d) {
     return d.data.key;
   }).attr("x", function(d){
     return d.x;
   }).attr("y", function(d){
     return d.y;
   }).style("text-anchor", "middle");
 }

that.init = init;
that.setAnswersWithCount = setAnswersWithCount;


return that;
};
