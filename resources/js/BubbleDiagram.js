/* eslint-env browser */
/* global EventPublisher */


var BubbleDiagram = (function() {
  "use strict";

  var that = new EventPublisher(),
    bubbleDiagramController = {},
    bubbleFilterView = {},
    bubbleCharts,
    bubbleModel = {},
    bubbleView = {},
    filter = {
      genderFilter: null,
      childFilter: null,
      dropDownFilter: null,
      sliderFilter: null
    },
    filterWrapper = {};

  // initializes all needed modules for the bubble diagrams
  function init() {
    bubbleCharts = d3.selectAll(".questionView");
    bubbleCharts._groups[0].forEach(function(element) {
      var bubbleSvg = d3.select(element).select(".bubbleDiagram");
      var question = d3.select(element).select("h2").node().innerText;
      var filters = d3.select(element).select(".standardFilters").node();
      bubbleView[question] = initBubbleView(bubbleSvg);
      bubbleModel[question] = initBubbleModel(question);
      bubbleDiagramController[question] = initBubbleDiagramController(question, filters);
      bubbleFilterView[question] = initBubbleFilterView(filters);
      filterWrapper[question] = filter;
    });
  }

  // initializes the BubbleDiagramController, delivers the needed html elements and sets the listeners
  function initBubbleDiagramController(question, filterNode) {
    var result;
    result = (new BubbleDiagram.BubbleDiagramController({
      filter: filterNode,
      genderFilter: d3.select(filterNode).select(".gender-filter").node(),
      childFilter: d3.select(filterNode).select(".child-filter").node(),
      slider: d3.select(filterNode).select(".slidecontainer").node(),
      question: question,
    })).init();

    result.setOnFilterClickListener(onOptionSelected);
    result.setOnGenderFilterClickListener(onGenderFilterClicked);
    result.setOnSliderClickListener(onSliderClicked);
    result.setOnChildFilterClickListener(onChildFilterClicked);
    return result;
  }

  // initializes the BubbleModel, delivers the path to the csv and the node of the current question and sets an event listener
  function initBubbleModel(question) {
    var result = (new BubbleDiagram.BubbleModel({
      csvPath: "data/flying-etiquette.csv",
      question: question,
    })).init();

    result.addEventListener("bubbleDataLoaded", onBubbleDataLoaded);
    return result;
  }

  //this function is called when the bubbleData in the BubbleModel has finished loading and than adds the data to the bubbleView Array
  function onBubbleDataLoaded(event) {
    bubbleView[event.data.question].setAnswersWithCount(event.data.answersWithCount);
  }

  // initializes thw BubbleView and delivers the node of the BubbleSvg
  function initBubbleView(bubbleSvg) {
    return (new BubbleDiagram.BubbleView({
      bubbleSvg: bubbleSvg,
    })).init();
  }

  // initializes the BubbleFilterView and delivers needed values
  function initBubbleFilterView(filterNode) {
    return (new BubbleDiagram.BubbleFilterView({
      filter: d3.select(filterNode),
      sliderValue: d3.select(filterNode).select(".current-value").node(),
    })).init();
  }

  // this function is called when there is a click on the gender filter
  // it updates the gender filter in the filter array and calls methods to update the display of bubbleDiagram and filters
  function onGenderFilterClicked(notificationData) {
    if (notificationData.value) {
      filter.genderFilter = notificationData.gender;
    } else {
      filter.genderFilter = null;
    }
    bubbleModel[notificationData.question].loadBubbleData(filterWrapper[notificationData.question]);

    bubbleFilterView[notificationData.question].updateGenderButton(notificationData.oppositeElement);
  }

  // this function is called if there is a click on the child filters
  // it updates the child filter in the filter array and calls a function to update the display of the bubbleDiagram
  function onChildFilterClicked(event) {
    if (event.value) {
      filter.childFilter = event.value;
    } else {
      filter.childFilter = null;
    }
    bubbleModel[event.question].loadBubbleData(filterWrapper[event.question]);
  }

  // this function is called if there is a click on the silder
  // it updates the slider filter in the filter array and calls a function to update the display of the bubbleDiagram
  function onSliderClicked(event) {
    bubbleFilterView[event.question].setSliderText(event.value);
    if (event.value == '') {
      filter.sliderFilter = null;
    } else {
      filter.sliderFilter = event.value;
    }
    bubbleModel[event.question].loadBubbleData(filterWrapper[event.question]);
  }

  // this function is called if an option of one of the dropDownFilters is selected
  // it updates the selected filter in the filter array and calls functions to update the display of the bubbleDiagram and Filters
  function onOptionSelected(event) {
    if (event.value.id) {
      filter.dropDownFilter = null;
    } else {
      filter.dropDownFilter = event.value;
    }
    bubbleModel[event.question].loadBubbleData(filterWrapper[event.question]);
    bubbleFilterView[event.question].setFilterText(event.value);
  }

  that.init = init;
  return that;
}());
