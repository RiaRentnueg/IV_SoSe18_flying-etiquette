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
  filter = {genderFilter : null, childFilter : null, dropDownFilter : null, sliderFilter : null},
  filterWrapper = {};

  function init() {
    bubbleCharts = d3.selectAll(".questionView");
    bubbleCharts._groups[0].forEach(function(element) {
      var bubbleSvg = d3.select(element).select(".bubbleDiagram");
      console.log(bubbleSvg);
      var legendSvg = d3.select(element).select(".legend");
      var question = d3.select(element).select("h2").node().innerText;
      var filters = d3.select(element).select(".standardFilters").node();
      bubbleView[question] = initBubbleView(bubbleSvg, legendSvg);
      bubbleModel[question] = initBubbleModel(question);
      bubbleDiagramController[question] = initBubbleDiagramController(question, filters);
      bubbleFilterView[question] = initBubbleFilterView(filters);
      filterWrapper[question] = filter;
    });
  }

  function initBubbleDiagramController(question, filterNode) {
    var result;
    if (document.querySelector(".special-filter") != null) {
      result = (new BubbleDiagram.BubbleDiagramController({
        filter:  filterNode,
        genderFilter: d3.select(filterNode).select(".gender-filter").node(),
        childFilter: d3.select(filterNode).select(".child-filter").node(),
        slider: d3.select(filterNode).select(".slidecontainer").node(),
        question: question,
      })).init();
    } else {
      result = (new BubbleDiagram.BubbleDiagramController({
        filter:  filterNode,
        genderFilter: d3.select(filterNode).select(".gender-filter").node(),
        question: question,
      })).init2();
    }
    console.log(result);
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

  function initBubbleView(bubbleSvg, legendSvg) {
    return (new BubbleDiagram.BubbleView({
      bubbleSvg: bubbleSvg,
      legendSvg: legendSvg,
    })).init();
  }

  function initBubbleFilterView(filterNode) {
    return (new BubbleDiagram.BubbleFilterView({
      filter:  d3.select(filterNode),
      sliderValue: d3.select(filterNode).select(".current-value").node(),
    })).init();
  }

  function onGenderFilterClicked(event) {
    console.log("onGenderFilterClicked");
    console.log(event);
    if (event.value) {
      filter.genderFilter = event.gender;
    } else {
      filter.genderFilter = null;
    }
    bubbleModel[event.question].loadBubbleData(filterWrapper[event.question]);

    bubbleFilterView[event.question].updateGenderButton(event.gender);
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
