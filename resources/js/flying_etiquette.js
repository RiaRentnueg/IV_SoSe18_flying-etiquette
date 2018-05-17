var d3 = d3 || {};

function doChart() {
  "use strict"
  var data, questions;

  var circleStartPoint = 250,
    circleDistance = 50,
    //currentCircleX = circleStartPoint;
    currentCircleX = 500,
    currentCircleY = circleStartPoint,
    xInY = circleStartPoint,
    xHelperVariable = 1,
    yHelperVariable = 1,
    circleXCoordinates = [],
    circleYCoordinates = [],
    currentRadius = 20,
    radiusX = [],
    radiusY = [],
    w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    windowWidth = w.innerWidth || e.clientWidth || g.clientWidth,
    windowHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;

    var mapQuestions = function(d) {
    return {
      tp: +d["RespondentID"],
      travel_frequency : d["How often do you travel by plane?"],
      seat_reclining : d["Do you ever recline your seat when you fly?"],
      size : d["How tall are you?"],
      having_children : d["Do you have any children under 18?"],
      two_arm_rests : d["In a row of three seats, who should get to use the two arm rests?"],
      middle_arm_rest : d["In a row of two seats, who should get to use the middle arm rest?"],
      window_shade : d["Who should have control over the window shade?"],
      unsold_seat : d["Is it rude to move to an unsold seat on a plane?"],
      speaking : d["Generally speaking, is it rude to say more than a few words to the stranger sitting next to you on a plane?"],
      getting_up : d["On a 6 hour flight from NYC to LA, how many times is it acceptable to get up if you're not in an aisle seat?"],
      seat_reclining_obligation : d["Under normal circumstances, does a person who reclines their seat during a flight have any obligation to the person sitting behind them?"],
      reclining_rude : d["Is it rude to recline your seat on a plane?"],
      reclining_elimination : d["Given the opportunity, would you eliminate the possibility of reclining seats on planes entirely?"],
      seat_switching_friends : d["Is it rude to ask someone to switch seats with you in order to be closer to friends?"],
      seat_switching_family : d["Is it rude to ask someone to switch seats with you in order to be closer to family?"],
      wake_up_bathroom : d["Is it rude to wake a passenger up if you are trying to go to the bathroom?"],
      wake_up_walking : d["Is it rude to wake a passenger up if you are trying to walk around?"],
      baby : d["In general, is it rude to bring a baby on a plane?"],
      unruly_children : d["In general, is it rude to knowingly bring unruly children on a plane?"],
      electronics : d["Have you ever used personal electronics during take off or landing in violation of a flight attendant's direction?"],
      smoking : d["Have you ever smoked a cigarette in an airplane bathroom when it was against the rules?"],
      gender : d["Gender"],
      age : d["Age"],
      income : d["Household Income"],
      education : d["Education"],
      location : d["Location (Census Region)"]
    };
    }



  d3.csv("data/flying-etiquette.csv", mapQuestions, function(error, data){
    var answersWithCount = d3.nest()
  .key(function(d) { return d.baby; })
  .rollup(function(v) { return v.length; })
  .entries(data);


  updateSVGWithData(answersWithCount, "#babyBubbleChart");

  })

   function updateSVGWithData(answersWithCount, selector){
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
    });
  }
};

doChart();
