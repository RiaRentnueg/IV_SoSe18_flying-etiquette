/* eslint-env browser */
/* global EventPublisher */


var BubbleDiagram = (function() {
  "use strict";

  var that = new EventPublisher(),
  bubbleDiagramController,
  bubbleFilterView,
  bubbleCharts,
  bubbleModel = {},
  bubbleView = {},
  filter = {genderFilter : null, childFilter : null, dropDownFilter : null, sliderFilter : null};

  function init() {
    bubbleCharts = d3.selectAll(".standardFilters");
    console.log(bubbleCharts);
    console.log(bubbleCharts._groups[0]);
    bubbleCharts._groups[0].forEach(function(element) {
      console.log(d3.select(element).select("svg"));
      console.log(d3.select(element).select("h2").node().innerText);
      var bubbleSvg = d3.select(element).select("svg");
      var question = d3.select(element).select("h2").node().innerText;
      bubbleView[question] = initBubbleView(bubbleSvg);
      bubbleModel[question] = initBubbleModel(question);
  });
    initBubbleDiagramController();
    //initBubbleView();
    initBubbleFilterView();
    //initBubbleModel();
  }

  function initBubbleDiagramController() {
    if (document.querySelector(".special-filter") != null) {
      bubbleDiagramController = (new BubbleDiagram.BubbleDiagramController({
        filter:  document.querySelector(".standardFilters"),
        genderFilter: document.querySelector(".gender-filter"),
        childFilter: document.querySelector(".child-filter"),
        slider: document.querySelector(".slidecontainer")
      })).init();
    } else {
      bubbleDiagramController = (new BubbleDiagram.BubbleDiagramController({
        filter:  document.querySelector(".standardFilters"),
        genderFilter: document.querySelector(".gender-filter"),
      })).init2();
    }
    bubbleDiagramController.setOnFilterClickListener(onOptionSelected);
    bubbleDiagramController.setOnGenderFilterClickListener(onGenderFilterClicked);
    bubbleDiagramController.setOnSliderClickListener(onSliderClicked);
    bubbleDiagramController.setOnChildFilterClickListener(onChildFilterClicked);
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

  function onGenderFilterClicked(checked, gender) {
    if (checked) {
      filter.genderFilter = gender;
    } else {
      filter.genderFilter = null;
    }
    bubbleModel.loadBubbleData(filter);

    bubbleFilterView.updateGenderButton(gender);
  }

  function onChildFilterClicked(checked) {
    if (checked) {
      filter.childFilter = checked;
    } else {
      filter.childFilter = null;
    }
    bubbleModel.loadBubbleData(filter);
  }


  function onSliderClicked(value) {
    bubbleFilterView.setSliderText(value);
    if (value == '') {
      filter.sliderFilter = null;
    } else {
      filter.sliderFilter = value;
    }
    bubbleModel.loadBubbleData(filter);
  }

  function onOptionSelected(textElement) {
    if (textElement.id) {
      filter.dropDownFilter = null;
    } else {
      filter.dropDownFilter = textElement;
    }
    bubbleModel.loadBubbleData(filter);
    bubbleFilterView.setFilterText(textElement);
  }

  that.init = init;
  return that;
}());
