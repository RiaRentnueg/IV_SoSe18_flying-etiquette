/* eslint-env browser */
/* global EventPublisher */

BubbleDiagram.BubbleView = function(params) {
    "use strict";

  var that = new EventPublisher(),
    selector;
  var transitionDelay = 1000;



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

   chartSVG.data(answersWithCount).enter().append("g");
    // bubbleNodes.exit().remove();

    var bubbleNodes = d3.selectAll(selector).select("g")

   var rootNode = d3.hierarchy({children: answersWithCount})
   .sum(function(d) { return d.value; });

   d3.pack().padding(2).size([960,960])(rootNode);

   var rootNodeChildren = rootNode.children;

   updateBubbles(rootNodeChildren, bubbleNodes);
   updateText(rootNodeChildren, bubbleNodes);


 }



function createBubbles (circles) {
   circles.enter().append("circle")
   .style("fill", function() {
     return "rgb(62,206,255)";
   }).call(setUpCircle);
 }

function updateBubbles (answersWithCount, bubbleNodes) {
   var circles = bubbleNodes.selectAll("circle").data(answersWithCount);

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
     return d.x;
   }).attr("cy", function(d){
     return d.y;
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
   return d.x;
 }).attr("y", function(d){
   return d.y;
 }).style("text-anchor", "middle");
 }

 function updateText (answersWithCount, bubbleNodes) {
   console.log(d3.selectAll(selector).selectAll("text"));
   var texts = bubbleNodes.selectAll("text").data(answersWithCount);

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
