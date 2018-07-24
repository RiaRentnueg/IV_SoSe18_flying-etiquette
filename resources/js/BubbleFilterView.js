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

    children.item(0).getElementsByClassName("textDropdown").item(0).innerHTML = "&nbsp;" + textElement.innerText;
  }

  //unchecks the box of the opposite gender (if gender female is clicked -> male box gets unchecked)
  function updateGenderButton(oppositeElement) {
    oppositeElement.checked = false;
  }

  that.init = init;
  that.setFilterText = setFilterText;
  that.setSliderText = setSliderText;
  that.updateGenderButton = updateGenderButton;

  return that;
};
