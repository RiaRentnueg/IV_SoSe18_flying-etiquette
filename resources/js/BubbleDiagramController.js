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
    var value = event.target.value;
    console.log(value);
    var heights = ['<5',"5'0\"","5'1\"","5'2\"","5'3\"","5'4\"","5'5\"","5'6\"","5'7\"","5'8\"",
  "5'9\"","5'10\"","5'11\"","6'0\"","6'1\"","6'2\"","6'3\"","6'4\"","6'5\"","<6'6\""]
    var i;
  for (i = 1; i < 20; i++) {
    if (value <= i*100/19) {
      value = heights[i];
    }
  }

    sliderFilterListener.forEach(function(listener) {
      listener(value);
    });
  }

  function onGenderFilterClicked(event) {
    var gender = event.target.id;
    var checked = false;
    if (event.target.checked) {
      checked = true;
      console.log("bdc");
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
