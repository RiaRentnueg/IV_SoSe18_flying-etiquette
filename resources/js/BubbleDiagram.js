/* eslint-env browser */
/* global EventPublisher */


var BubbleDiagram = (function() {
  "use strict";

  var that = new EventPublisher(),
  bubbleDiagramController = {},
  bubbleFilterView,
  bubbleCharts,
  bubbleModel = {},
  bubbleView = {},
  filter = {genderFilter : null, childFilter : null, dropDownFilter : null, sliderFilter : null};

  function init() {
    bubbleCharts = d3.selectAll(".questionView");
    console.log(bubbleCharts);
    console.log(bubbleCharts._groups[0]);
    bubbleCharts._groups[0].forEach(function(element) {
      console.log(d3.select(element).select("svg"));
      console.log(d3.select(element).select("h2").node().innerText);
      var bubbleSvg = d3.select(element).select("svg");
      var question = d3.select(element).select("h2").node().innerText;
      bubbleView[question] = initBubbleView(bubbleSvg);
      bubbleModel[question] = initBubbleModel(question);
      bubbleDiagramController[question] = initBubbleDiagramController(question);

  });
    //initBubbleView();
    initBubbleFilterView();
    //initBubbleModel();
  }

  function initBubbleDiagramController(question) {
    var result;
    if (document.querySelector(".special-filter") != null) {
      result = (new BubbleDiagram.BubbleDiagramController({
        filter:  document.querySelector(".standardFilters"),
        genderFilter: document.querySelector(".gender-filter"),
        childFilter: document.querySelector(".child-filter"),
        slider: document.querySelector(".slidecontainer"),
        question: question,
      })).init();
    } else {
      result = (new BubbleDiagram.BubbleDiagramController({
        filter:  document.querySelector(".standardFilters"),
        genderFilter: document.querySelector(".gender-filter"),
        question: question,
      })).init2();
    }
    result.setOnFilterClickListener(onOptionSelected);
    result.setOnGenderFilterClickListener(onGenderFilterClicked);
    result.setOnSliderClickListener(onSliderClicked);
    result.setOnChildFilterClickListener(onChildFilterClicked);
    return result;
  }

  function initBubbleModel(question) {
    var result = (new BubbleDiagram.BubbleModel({
      csvPath: "data/flying-etiquette.csv",
      question: question,
    })).init();

    result.addEventListener("bubbleDataLoaded", onBubbleDataLoaded);
    return result;
  }

  function onBubbleDataLoaded (event){
    bubbleView[event.data.question].setAnswersWithCount(event.data.answersWithCount);
  }

  function initBubbleView(bubbleSvg) {
    return (new BubbleDiagram.BubbleView({
      bubbleSvg: bubbleSvg,
    })).init();
  }

  function initBubbleFilterView() {
    bubbleFilterView = (new BubbleDiagram.BubbleFilterView({
      filter:  document.querySelector(".standardFilters"),
      sliderValue: document.querySelector(".current-value"),
    })).init();
  }

  function onGenderFilterClicked(event) {
console.log(event);
    if (event.value) {
      filter.genderFilter = event.gender;
    } else {
      filter.genderFilter = null;
    }
    console.log(filter);
    bubbleModel[event.question].loadBubbleData(filter);

    bubbleFilterView.updateGenderButton(event.gender);
  }

  function onChildFilterClicked(event) {
    if (event.value) {
      filter.childFilter = event.value;
    } else {
      filter.childFilter = null;
    }
    bubbleModel[event.question].loadBubbleData(filter);
  }


  function onSliderClicked(event) {
    bubbleFilterView.setSliderText(event.value);
    if (event.value == '') {
      filter.sliderFilter = null;
    } else {
      filter.sliderFilter = event.value;
    }
    bubbleModel[event.question].loadBubbleData(filter);
  }

  function onOptionSelected(event) {
    if (event.value.id) {
      filter.dropDownFilter = null;
    } else {
      filter.dropDownFilter = event.value;
    }
    bubbleModel[event.question].loadBubbleData(filter);
    bubbleFilterView.setFilterText(event.value);
  }

  that.init = init;
  return that;
}());
