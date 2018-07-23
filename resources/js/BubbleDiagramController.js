/* eslint-env browser */

var BubbleDiagram = BubbleDiagram || {};
BubbleDiagram.BubbleDiagramController = function(params) {
    "use strict";

  var that = {},
    question,
    filter,
    genderFilter,childFilter,
    slider,
    sliderFilterListener = [],
    childFilterClickListeners = [],
    filterSelectionListeners = [],
    genderFilterListeners = [];

  function init() {
    question = params.question;
    filter = params.filter;
    genderFilter = params.genderFilter;
    if(params.childFilter != null){
      childFilter = params.childFilter;
      childFilter.addEventListener("change", onChildFilterClicked);
    }
    if(params.slider != null){
      slider = params.slider;
      slider.addEventListener("input", onSliderClicked);
    }
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
    var notificationData = {
      question: question,
      value: checked
    }
    childFilterClickListeners.forEach(function(listener) {
      listener(notificationData);
    });
  }

  function onSliderClicked(event) {
    var originalVal = event.target.value;
    var value = event.target.value;
    var heights = ['<5',"5'0\"","5'1\"","5'2\"","5'3\"","5'4\"","5'5\"","5'6\"","5'7\"","5'8\"",
    "5'9\"","5'10\"","5'11\"","6'0\"","6'1\"","6'2\"","6'3\"","6'4\"","6'5\"","<6'6\""]
    var i;
    for (i = 1; i < 20; i++) {
      if (originalVal == 0) {
        value = '';
      } else
      if (value <= i*100/19) {
        value = heights[i];
      }
    }
    var notificationData = {
      question: question,
      value: value
    }
    sliderFilterListener.forEach(function(listener) {
      listener(notificationData);
    });
  }

  function onGenderFilterClicked(event) {
    var gender = event.target.className;
    var oppositeElement;
    if (gender.includes("female")) {
      gender = "female";
      //retrieve the include tag for gender male
      oppositeElement = event.target.nextElementSibling.nextElementSibling;
    }else if (gender.includes("male")) {
      gender = "male";
      //retrieve the include tag for gender female
      oppositeElement = event.target.previousElementSibling.previousElementSibling;
    }

    var checked = false;
    if (event.target.checked) {
      checked = true;
    } else {
      checked = false;
    }
    var notificationData = {
      question: question,
      value: checked,
      gender: gender,
      oppositeElement: oppositeElement
    }
    genderFilterListeners.forEach(function(listener) {
      listener(notificationData);
    });

  }

  function onFilterOptionClicked(event) {
    var textElement = event.target.parentElement;
    var notificationData = {
      question: question,
      value: textElement
    }
    if (textElement.tagName == "LI") {
      filterSelectionListeners.forEach(function(listener) {
        listener(notificationData);
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
  that.setOnFilterClickListener = setOnFilterClickListener;
  that.setOnGenderFilterClickListener = setOnGenderFilterClickListener;
  that.setOnSliderClickListener = setOnSliderClickListener;
  that.setOnChildFilterClickListener = setOnChildFilterClickListener;

  return that;
};
