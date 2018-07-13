/* eslint-env browser */
/* global EventPublisher */

BubbleDiagram.BubbleView = function(params) {
    "use strict";

  var that = new EventPublisher(),
    bubbleSvg, bubbleChartId;
  var bubbleColors = {}, colorObj = {}, dataArr = [], lineX1 = [], lineY1 = [],
  transitionDelay = 1000,
  initialPackSize = 960,
  diagramShift;
  //seat reclining colors are missing -> diagrams not correct in html
  //need to rename bubbleChart ids in seat
  var bubbleChartColors = {
    babyBubbleChart: [245, 124, 0],
    babyUnrulyBubbleChart: [251, 140, 0],
    seatTwoArmrestBubbleChart: [106, 27, 154],
    seatMiddleArmrestBubbleChart: [123, 31, 162],
    seatWindowShadeBubbleChart: [142, 36, 170],
    reclineSeatBubbleChart: [229, 57, 53],
    reclineSeatObligationBubbleChart: [211, 47, 47],
    reclineSeatPossibilityBubbleChart: [244, 67, 54],
    generalSpeakingBubbleChart: [158, 157, 36],
    getUpAisleBubbleChart: [175, 180, 43],
    bathroomWakeUpBubbleChart: [192, 202, 51],
    walkArounfWakeUpBubbleChart: [205, 220, 57],
    switchSeatsFriendsBubbleChart: [0, 151, 167],
    switchSeatsFamiliyBubbleChart: [0, 172, 193],
    unsoldSeatBubbleChart: [0, 131, 143],
    electronicsLandingBubbleChart: [27, 94, 32],
    smokingBubbleChart: [46, 125, 50]
  }



  function init() {
    bubbleSvg = params.bubbleSvg;
    bubbleChartId = bubbleSvg._groups[0][0].id;
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

function handleMouseOver(d, i) {
  console.log("mouse over");
  console.log(d);
  console.log(i);
  bubbleSvg.append("text").attr("id", "hoverText").text(d.value).attr("x", d.x).attr("y", d.y);
}

function handleMouseOut(){
  bubbleSvg.select("#hoverText").remove();
  console.log("mouse out");
}

 function createBubbles (circles) {

   var rgbValues = bubbleChartColors[bubbleChartId];

   var factor = 1.0;
   var circle = circles.enter().append("circle")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

    circle.style("fill", function(d, i) {
       var color;
       if(Object.keys(colorObj).length === 0 && colorObj.constructor === Object){
         //color = "hsl(" + (baseColor ) + ",100%,"+(30+ (d.parent.children.indexOf(d) * 15))+"%)";
         color = "rgb(" + rgbValues.map(x => x * factor).join(",") + ")";
         factor -= 0.1;
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
   let xValue = 0;
   let yValue = 30;

  let texts = selection.attr("x", function(d,i){
    let textWidth = this.innerHTML.length*10;
    let result = xValue + textWidth/2;
    let padding = textWidth/2 + 15;

    if (xValue === 0) {
      xValue = textWidth;
      result = padding;
    }
    xValue = result + textWidth;
    console.log(result);

    console.log("x:");
    console.log(xValue);

    if ( xValue > 960 ) {
      console.log("break");
      xValue = textWidth;
      result = padding;
      yValue += 40;
    }


    console.log("y:");
    console.log(yValue);
    lineX1.push(result);
    lineY1.push(yValue);
   return lineX1[i];
 }).attr("y", function(d,i){

   return lineY1[i]-10;
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

   selection
   .attr("x1", function(d,i){
     let result = lineX1[i];
     //lineX1.shift();
    return result;
  }).attr("y1", function(d,i){
    let result = lineY1[i];
    //lineY1.shift();
   return result;
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
