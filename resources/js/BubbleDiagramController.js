/* eslint-env browser */

var BubbleDiagram = BubbleDiagram || {};
BubbleDiagram.BubbleDiagramController = function(params) {
    "use strict";

  var that = {},
    filter,
    genderFilter,
    filterSelectionListeners = [],
    genderFilterListeners = [];

  function init() {
    filter = params.filter;
    genderFilter = params.genderFilter;
    filter.addEventListener("click", onFilterOptionClicked);
    genderFilter.addEventListener("click", onGenderFilterClicked);
    //filter.getElementsByClassName("radio-inline").addEventListener("click", onGenderFilterClicked);
    return that;
  }

  function onGenderFilterClicked(event) {
    var gender = event.target.id;
    genderFilterListeners.forEach(function(listener) {
      listener(gender);
    });

  }

  function onFilterOptionClicked(event) {
    var textElement = event.target.parentElement;
    if (textElement.tagName == "LI") {
      filterSelectionListeners.forEach(function(listener) {
        listener(textElement);
      });
    }
  }

  function setOnGenderFilterClickListener(listener) {
    genderFilterListeners.push(listener);
  }

  function setOnFilterClickListener (listener) {
    filterSelectionListeners.push(listener);
  }


  that.init = init;
  that.setOnFilterClickListener = setOnFilterClickListener;
  that.setOnGenderFilterClickListener = setOnGenderFilterClickListener;

  return that;
};
