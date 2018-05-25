/* eslint-env browser */
/* global EventPublisher */

BubbleDiagram.BubbleModel = function(params) {
    "use strict";

  var that = new EventPublisher(),
    csvPath;


  function init() {
    csvPath = params.csvPath;
    loadBubbleData({});
    return that;
  }

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

  function loadBubbleData(filter){
    d3.csv(csvPath, mapQuestions, function(error, data){

    var filteredData = data.filter(function(d) {
      var result = true;

      if (filter.genderFilter) {
        result = (d.gender.toLowerCase() === filter.genderFilter.toLowerCase());
      }

      return result;
    });

    var answersWithCount = d3.nest()
      .key(function(d) { return d.baby; })
      .rollup(function(v) { return v.length; })
      .entries(filteredData);

    that.notifyAll("bubbleDataLoaded", answersWithCount);
    })

  }
that.init = init;
that.loadBubbleData = loadBubbleData;

return that;
};