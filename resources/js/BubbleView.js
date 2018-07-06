/* eslint-env browser */
/* global EventPublisher */

BubbleDiagram.BubbleView = function(params) {
    "use strict";

  var that = new EventPublisher(),
    bubbleSvg;
  var bubbleColors = {}, colorObj = {}, dataArr = [], xDataCircle = [], yDataCircle = [], xDataText = [], yDataText = [],
  transitionDelay = 1000,
  initialPackSize = 960,
  diagramShift;



  function init() {
    bubbleSvg = params.bubbleSvg;
    return that;
  }

  //updates bubblediagrams with current size and answers (depending in witch filters are selected)
  function setAnswersWithCount(answersWithCount){
    //viewBox is needed for making the bubbleChart responsive
    var chartSVG = bubbleSvg
     .attr("viewBox","0 0 960 960")
     .attr("preserveAspectRatio","xMinYMid")
     .selectAll("svg");

   var rootNode = d3.hierarchy({children: answersWithCount})
   .sum(function(d) {
     return d.value;
   });

   var currentPackSize = rootNode.value;//* tpCount;

   d3.pack().padding(2).size([currentPackSize,currentPackSize])(rootNode);

   var rootNodeChildren = rootNode.children;

   updateBubbles(rootNodeChildren, bubbleSvg);
   updateText(rootNodeChildren, bubbleSvg);
   updateLines(rootNodeChildren, bubbleSvg);
  // appendLines(answersWithCount);
 }


 function createBubbles (circles) {

   var baseColor = (Math.random() * 360);
   var circle = circles.enter().append("circle");
    circle.style("fill", function(d, i) {
       var color;
       if(Object.keys(colorObj).length === 0 && colorObj.constructor === Object){
         color = "hsl(" + (baseColor ) + ",100%,"+(30+ (d.parent.children.indexOf(d) * 15))+"%)";

         var obj = {key: d, value: color};
         dataArr.push(obj);
       } else {
         color = colorObj.children[i].data.value;
       }



       return color;
     });
     if (Object.keys(colorObj).length === 0 && colorObj.constructor === Object) {
       var rootNode = d3.hierarchy({children: dataArr})
       .sum(
         function(d) { return d.value;});

       var currentPackSize = rootNode.value;//* tpCount;

       d3.pack().padding(2).size([currentPackSize,currentPackSize])(rootNode);

       dataArr = rootNode.children;

       colorObj = {name: "legendArray", size: dataArr.length, children: dataArr};
    }
    circle.call(setUpCircle);
  }

  function updateBubbles (answersWithCount, bubbleSvg) {

    var dataObj = {name: "bubbleArray", size: 856, children: answersWithCount};
    var circles = bubbleSvg.selectAll("circle").data(answersWithCount);
    circles.exit().remove();
    createBubbles(circles);
    //duration is needed, to make the transitions of the bubbles smooth
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

   selection.attr("x1", function(d,i){
    return 300+i*200;
  }).attr("y1", function(d){
    return 40;
  }).attr("x2", function(d,i){
   var diagramShift = (856 - d.parent.value)/2;
   return d.x + diagramShift;
 }).attr("y2", function(d){
    var diagramShift = (856 - d.parent.value)/2;
    return d.y + diagramShift;
 }).style("stroke", function(d) {
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
