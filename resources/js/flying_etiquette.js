var d3 = d3 || {};

function doChart() {
  "use strict"
  var data, questions, babySVG, babyUpdate, babyEnter;

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


  data = d3.csv("data/flying-etiquette.csv", function(d) {
  return {
    tp: +d["RespondentID"],
    travel_frequency : d["How often do you travel by plane?"],
    seat_reclining : d["Do you ever recline your seat when you fly?"],
    size : d["How tall are you?"],
    having_children : d["Do you have any children under 18?"],
    two_arm_rests : d["In a row of three seats, who should get to use the two arm rests?"],
    middle_arm_rest : d["In a row of two seats, who should get to use the middle arm rest?"],
    window_shade : d["Who should have control over the window shade?"],
    unsold_seat : d["Is itrude to move to an unsold seat on a plane?"],
    speaking : d["Generally speaking, is it rude to say more than a few words tothe stranger sitting next to you on a plane?"],
    getting_up : d["On a 6 hour flight from NYC to LA, how many times is it acceptable to get up if you're not in an aisle seat?"],
    seat_reclining_obligation : d["Under normal circumstances, does a person who reclines their seat during a flight have any obligation to the person sitting behind them?"],
    reclining_rude : d["Is itrude to recline your seat on a plane?"],
    reclining_elimination : d["Given the opportunity, would you eliminate the possibility of reclining seats on planes entirely?"],
    seat_switching_friends : d["Is it rude to ask someone to switch seats with you in order to be closer to friends?"],
    seat_switching_family : d["Is itrude to ask someone to switch seats with you in order to be closer to family?"],
    wake_up_bathroom : d["Is it rude to wake a passenger up if you are trying to go to the bathroom?"],
    wake_up_walking : d["Is itrude to wake a passenger up if you are trying to walk around?"],
    baby : d["In general, is itrude to bring a baby on a plane?"],
    unruly_children : d["In general, is it rude to knowingly bring unruly children on a plane?"],
    electronics : d["Have you ever used personal electronics during take off or landing in violation of a flight attendant's direction?"],
    smoking : d["Have you ever smoked a cigarette in an airplane bathroom when it was against the rules?"],
    gender : d["Gender"],
    age : d["Age"],
    income : d["Household Income"],
    education : d["Education"],
    location : d["Location (Census Region)"]
  };
  }, function(error, data){
    console.log(data);
    console.log(data.columns);

    questions = data.columns;
    console.log(data[1]["In general, is itrude to bring a baby on a plane?"]);
    babySVG = d3.select("#babyBubbleChart").style("width", windowWidth).style("height", 50*windowHeight).selectAll("svg");
    console.log(babySVG);
    var allBabiesAnswersCounted = d3.nest()
  .key(function(d) { return d.baby; })
  .rollup(function(v) { return v.length; })
  .entries(data);
    console.log(allBabiesAnswersCounted);
    console.log(JSON.stringify(allBabiesAnswersCounted));
    console.log(allBabiesAnswersCounted[1]);

    babyUpdate =  babySVG.data(allBabiesAnswersCounted);
    babyEnter = babyUpdate.enter().append("g");

    addTextToBubbles(allBabiesAnswersCounted, babyEnter);
    createBubbleData(allBabiesAnswersCounted, babyEnter, babySVG);

  })


  function addTextToBubbles(data, chartEnter){
      chartEnter.append("text").text(function (d) {return d.key; })
      .data(circleXCoordinates).attr("x", function (d) {
        return d.value;
      } ).data(circleYCoordinates).attr("y", function (d) {
        return d.value;
      });
    }

  function createBubbleData(data, chartEnter, chart) {
    "use strict";
  var bubbleArray = data, dataObj, pack, rootNode;



  console.log(bubbleArray);
  dataObj = {children: bubbleArray};
  pack = d3.pack().padding(2).size([800,600]);

  rootNode = d3.hierarchy(dataObj)
      .sum(function(d) { return d.value; })
      .sort(function(a, b) { return b.value - a.value; });

  pack(rootNode);
  console.log(rootNode);

  d3.select("body").selectAll("g").append("circle").data(rootNode.children)
  .style("fill", function() {
    return "rgb(62,206,255)";
  }).style("r", function (d){
    console.log("hier");
    return d.r;
  }).attr("cx", function(d){
    return d.x;
  }).attr("cy", function(d){
    return d.y;
  });

  d3.select("#babyBubbleChart").selectAll("g").append("text").data(rootNode.children).text(function (d) {
    return d.data.key;
  }).attr("x", function(d){
    return d.x;
  }).attr("y", function(d){
    return d.y;
  });
}








};

doChart();
