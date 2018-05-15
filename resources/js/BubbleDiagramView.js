/* eslint-env browser */
/* global BubbleDiagram */

BubbleDiagram.BubbleDiagramView = function(params) {
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

  that.init = init;
  that.setFilterText = setFilterText;
  that.setSliderText = setSliderText;

  return that;
};
