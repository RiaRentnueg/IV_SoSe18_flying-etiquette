/* eslint-env browser */

var BubbleDiagram = BubbleDiagram || {};
BubbleDiagram.BubbleDiagramController = function(params) {
    "use strict";

  var that = {},
    filter,
    genderFilter,childFilter,
    slider,
    sliderFilterListener = [],
    childFilterClickListeners = [],
    filterSelectionListeners = [],
    genderFilterListeners = [];

  function init() {
    filter = params.filter;
    genderFilter = params.genderFilter;
    slider = params.slider;
    childFilter = params.childFilter;
    childFilter.addEventListener("change", onChildFilterClicked);
    slider.addEventListener("input", onSliderClicked);
    filter.addEventListener("click", onFilterOptionClicked);
    genderFilter.addEventListener("click", onGenderFilterClicked);
    return that;
  }

  function init2() {
    filter = params.filter;
    genderFilter = params.genderFilter;
    filter.addEventListener("click", onFilterOptionClicked);
    genderFilter.addEventListener("click", onGenderFilterClicked);
    return that;
  }

  function onChildFilterClicked(event) {
    var checked = false;
    if (event.target.checked) {
      checked = true;
    } else {
      checked = false;
    }
    childFilterClickListeners.forEach(function(listener) {
      listener(checked);
    });
  }

  function onSliderClicked(event) {
    console.log("WTF");
    console.log("hallo");
    var value = event.target;
    sliderFilterListener.forEach(function(listener) {
      listener(value);
    });
  }

  function onGenderFilterClicked(event) {
    var gender = event.target.id;
    var checked = false;
    if (event.target.checked) {
      checked = true;
    } else {
      checked = false;
    }
    genderFilterListeners.forEach(function(listener) {
      listener(checked, gender);
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

  function setOnSliderClickListener(listener) {
    sliderFilterListener.push(listener);
  }

  function setOnGenderFilterClickListener(listener) {
    genderFilterListeners.push(listener);
  }

  function setOnFilterClickListener (listener) {
    filterSelectionListeners.push(listener);
  }

  function setOnChildFilterClickListener(listener) {
    childFilterClickListeners.push(listener);
  }


  that.init = init;
  that.init2 = init2;
  that.setOnFilterClickListener = setOnFilterClickListener;
  that.setOnGenderFilterClickListener = setOnGenderFilterClickListener;
  that.setOnSliderClickListener = setOnSliderClickListener;
  that.setOnChildFilterClickListener = setOnChildFilterClickListener;

  return that;
};
