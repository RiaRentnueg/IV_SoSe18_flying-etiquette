/* eslint-env browser */

var BubbleDiagram = (function() {
  "use strict";

  var that = {},
  bubbleDiagramController,
  bubbleDiagramView;

  function init() {
    initBubbleDiagramController();
    initBubbleDiagramView();
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

  function initBubbleDiagramView() {
    bubbleDiagramView = (new BubbleDiagram.BubbleDiagramView({
      filter:  document.querySelector(".standardFilters"),
      sliderValue: document.querySelector(".current-value"),
    })).init();
  }

  function onGenderFilterClicked(checked, gender) {
    console.log(checked);
    console.log(gender);
  }

  function onChildFilterClicked(child) {
    console.log(child);
  }


  function onSliderClicked(value) {
    console.log("click");
    bubbleDiagramView.setSliderText(value)

  }

  function onOptionSelected(textElement) {
    bubbleDiagramView.setFilterText(textElement);
  }

  that.init = init;
  return that;
}());
