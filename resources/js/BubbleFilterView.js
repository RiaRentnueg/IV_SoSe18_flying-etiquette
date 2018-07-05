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

  function updateGenderButton(gender){
    console.log("updateGenderButton");
    if (gender === "male") {
      console.log("gender = male");
      document.querySelector(".female").checked = false;
    } else if (gender === "female") {
      console.log("gender = female");
      document.querySelector(".male").checked = false;
    } else if (gender === "") {
      console.log("no gender");
      document.querySelector(".female").checked = false;
      document.querySelector(".male").checked = false;
    }
  }

  that.init = init;
  that.setFilterText = setFilterText;
  that.setSliderText = setSliderText;
  that.updateGenderButton = updateGenderButton;

  return that;
};
