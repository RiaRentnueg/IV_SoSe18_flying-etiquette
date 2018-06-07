/* eslint-env browser */
/* global BubbleDiagram */

BubbleDiagram.BubbleFilterView = function(params) {
    "use strict";

  var that = {},
  filter, sliderValue;


  function init() {
    filter = params.filter;
    sliderValue = params.sliderValue;
    return that;
  }

  function setSliderText(value) {
    sliderValue.innerText = "Height: " + value;
  }


  function setFilterText(textElement) {
    var children = textElement.parentElement.parentElement.children;
    children.item(0).innerText = textElement.innerText;
  }

  function updateGenderButton(gender){
    if (gender === "male") {
      document.querySelector("#female").checked = false;
    } else if (gender === "female") {
      document.querySelector("#male").checked = false;
    } else if (gender === "") {
      document.querySelector("#female").checked = false;
      document.querySelector("#male").checked = false;
    }
  }

  that.init = init;
  that.setFilterText = setFilterText;
  that.setSliderText = setSliderText;
  that.updateGenderButton = updateGenderButton;

  return that;
};
