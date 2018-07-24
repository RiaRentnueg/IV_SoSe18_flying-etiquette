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

  function initBubbleModel(question) {
    var result = (new BubbleDiagram.BubbleModel({
      csvPath: "data/flying-etiquette.csv",
      question: question,
    })).init();

    result.addEventListener("bubbleDataLoaded", onBubbleDataLoaded);
    return result;
  }

  function onBubbleDataLoaded(event) {
    bubbleView[event.data.question].setAnswersWithCount(event.data.answersWithCount);
  }

  function initBubbleView(bubbleSvg) {
    return (new BubbleDiagram.BubbleView({
      bubbleSvg: bubbleSvg,
    })).init();
  }

  function initBubbleFilterView(filterNode) {
    return (new BubbleDiagram.BubbleFilterView({
      filter: d3.select(filterNode),
      sliderValue: d3.select(filterNode).select(".current-value").node(),
    })).init();
  }

  function onGenderFilterClicked(notificationData) {
    if (notificationData.value) {
      filter.genderFilter = notificationData.gender;
    } else {
      filter.genderFilter = null;
    }
    bubbleModel[notificationData.question].loadBubbleData(filterWrapper[notificationData.question]);

    bubbleFilterView[notificationData.question].updateGenderButton(notificationData.oppositeElement);
  }

  function onChildFilterClicked(event) {
    if (event.value) {
      filter.childFilter = event.value;
    } else {
      filter.childFilter = null;
    }
    bubbleModel[event.question].loadBubbleData(filterWrapper[event.question]);
  }


  function onSliderClicked(event) {
    bubbleFilterView[event.question].setSliderText(event.value);
    if (event.value == '') {
      filter.sliderFilter = null;
    } else {
      filter.sliderFilter = event.value;
    }
    bubbleModel[event.question].loadBubbleData(filterWrapper[event.question]);
  }

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
