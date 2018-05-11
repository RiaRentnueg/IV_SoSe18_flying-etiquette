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
    bubbleDiagramController = (new BubbleDiagram.BubbleDiagramController({
      filter:  document.querySelector(".standardFilters"),
      genderFilter: document.querySelector(".gender-filter"),
    })).init();
    bubbleDiagramController.setOnFilterClickListener(onOptionSelected);
    bubbleDiagramController.setOnGenderFilterClickListener(onGenderFilterClicked);
  }

  function initBubbleDiagramView() {
    bubbleDiagramView = (new BubbleDiagram.BubbleDiagramView({
      filter:  document.querySelector(".standardFilters"),
    })).init();
  }

  function onGenderFilterClicked(gender) {
    console.log(gender);
  }

  function onOptionSelected(textElement) {
    bubbleDiagramView.setFilterText(textElement);
  }

  that.init = init;
  return that;
}());
