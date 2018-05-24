/* eslint-env browser */
/* global EventPublisher */


var BubbleDiagram = (function() {
  "use strict";

  var that = new EventPublisher(),
  bubbleDiagramController,
  bubbleView,
  bubbleFilterView,
  bubbleModel,
  filter = {genderFilter : null};

  function init() {
    initBubbleDiagramController();
    initBubbleView();
    initBubbleFilterView();
    initBubbleModel();
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

  function initBubbleModel() {
    bubbleModel = (new BubbleDiagram.BubbleModel({
      csvPath: "data/flying-etiquette.csv",
    })).init();

    bubbleModel.addEventListener("bubbleDataLoaded", onBubbleDataLoaded);
  }

  function onBubbleDataLoaded (event){
    console.log("eventData");
    console.log(event.data);
    bubbleView.setAnswersWithCount(event.data);
  }

  function initBubbleView() {
    bubbleView = (new BubbleDiagram.BubbleView({
      selector: "#babyBubbleChart",
    })).init();
  }

  function initBubbleFilterView() {
    bubbleFilterView = (new BubbleDiagram.BubbleFilterView({
      filter:  document.querySelector(".standardFilters"),
      sliderValue: document.querySelector(".current-value"),
    })).init();
  }

  function onGenderFilterClicked(checked, gender) {
    console.log(checked);
    console.log(gender);
    if (checked) {
      filter.genderFilter = gender;
    } else {
      filter.genderFilter = null;
    }
    bubbleModel.loadBubbleData(filter);

    bubbleFilterView.updateGenderButton(gender);
  }

  function onChildFilterClicked(child) {
    console.log(child);
  }


  function onSliderClicked(value) {
    console.log("click");
    bubbleFilterView.setSliderText(value)

  }

  function onOptionSelected(textElement) {
    bubbleFilterView.setFilterText(textElement);
  }

  that.init = init;
  return that;
}());
