/* eslint-env browser */
/* global EventPublisher */

BubbleDiagram.BubbleModel = function(params) {
    "use strict";

  var that = new EventPublisher(),
    csvPath,
    question;


  function init() {
    csvPath = params.csvPath;
    question = params.question;
    loadBubbleData({});
    return that;
  }


  function loadBubbleData(filter){
    d3.csv(csvPath, function(error, data){

    var filteredData = data.filter(function(d) {
      var result = true;

      if (result && filter.genderFilter) {
        result = (d["Gender"].toLowerCase() === filter.genderFilter.toLowerCase());
      }

      if (result && filter.childFilter) {
        var answer = "";
        if (filter.childFilter) {
          answer = "yes"
        } else {
          answer = "no"
        }
        result = d["Do you have any children under 18?"].toLowerCase() === answer;
      }

      if (result && filter.dropDownFilter) {
        if (result && filter.dropDownFilter.parentElement.children[1].id === "freq") {
          result = (d["How often do you travel by plane?"] === filter.dropDownFilter.innerHTML.replace('<a>','').replace('</a>',''));
        }
        if (result && filter.dropDownFilter.parentElement.children[1].id === "age") {
          var age = filter.dropDownFilter.innerHTML.replace('<a>','').replace('</a>','');
          if (age === "&gt; 60") {
            age = '> 60';
          }
          result = (d["Age"] === age);
        }
        if (result && filter.dropDownFilter.parentElement.children[1].id === "income") {
          result = (d["Household Income"] === filter.dropDownFilter.innerHTML.replace('<a>','').replace('</a>',''));
        }
        if (result && filter.dropDownFilter.parentElement.children[1].id === "seatReq") {
          result = (d["Do you ever recline your seat when you fly?"] === filter.dropDownFilter.innerHTML.replace('<a>','').replace('</a>',''));
        }
        if (result && filter.dropDownFilter.parentElement.children[1].id === "degree") {
          result = (d["Education"] === filter.dropDownFilter.innerHTML.replace('<a>','').replace('</a>',''));
        }
        if (result && filter.dropDownFilter.parentElement.children[1].id === "location") {
          result = (d["Location (Census Region)"] === filter.dropDownFilter.innerHTML.replace('<a>','').replace('</a>',''));
        }
      }

      if (result && filter.sliderFilter) {
        result = d["How tall are you?"] === filter.sliderFilter;
      }

      return result;
    });

    var answersWithCount = d3.nest()
      .key(function(d) { return d[question]; })
      .rollup(function(v) { return v.length; })
      .entries(filteredData);
      console.log(answersWithCount);

    var notificationData = {
      question : question,
      answersWithCount : answersWithCount
    }

    that.notifyAll("bubbleDataLoaded", notificationData);
    })

  }
that.init = init;
that.loadBubbleData = loadBubbleData;

return that;
};
