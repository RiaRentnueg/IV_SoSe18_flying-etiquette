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
    console.log(value);
    sliderValue.innerText = "Height: " + value.value;
  }


  function setFilterText(textElement) {
    var children = textElement.parentElement.parentElement.children;
    children.item(0).innerText = textElement.innerText;

  //  console.log(text.getElementsByClassName("btn btn-primary dropdown-toggle"));
//  text.getElementsByClassName("btn btn-primary dropdown-toggle").innerText = text;

  }

  function updateGenderButton(gender){
    if (gender === "male") {
      document.querySelector("#female").checked = false;
    } else if (gender === "female") {
      document.querySelector("#male").checked = false;
    }
  }

  that.init = init;
  that.setFilterText = setFilterText;
  that.setSliderText = setSliderText;
  that.updateGenderButton = updateGenderButton;

  return that;
};
