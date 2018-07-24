/* eslint-env browser */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette.StartDiagramController = function() {
    "use strict";

    var that = {},
      dots,
      innerRingSegments,
      outerRingSegments,
      outerInfoText,
      innerInfoText,
      dotsInfoText,
      colorInformation = [],
      colorRange = ["#1565C0", "#B71C1C", "#C62828", "#EF6C00", "#6A1B9A", "#7B1FA2", "#8E24AA", "#00838F", "#9E9D24", "#AFB42B", "#D32F2F", "#E53935", "#F44336", "#0097A7", "#00ACC1", "#C0CA33", "#CDDC39", "#F57C00", "#FB8C00", "#1B5E20", "#2E7D32", "#1976D2", "#1E88E5", "#2196F3", "#42A5F5", "#64B5F6"];
    
    function setupEventListeners() {
        dots = document.querySelectorAll(".participantDots");
        outerRingSegments = document.querySelectorAll(".outer");
        innerRingSegments = document.querySelectorAll(".inner");

        outerInfoText = document.querySelector(".outerInfoText");
        innerInfoText = document.querySelector(".innerInfoText");
        dotsInfoText = document.querySelector(".dotsInfoText");
        
        for(let i = 0; i < outerRingSegments.length; i++) {
            outerRingSegments[i].addEventListener("mouseover", showOuterRingInformation);
            outerRingSegments[i].addEventListener("mouseleave", removeOuterRingInformation);
        }
        
        for(let j = 0; j < innerRingSegments.length; j++) {
            innerRingSegments[j].addEventListener("click", changeDotsColor);
            innerRingSegments[j].addEventListener("mouseover", showInnerRingInformation);
            innerRingSegments[j].addEventListener("mouseleave", removeInnerRingInformation);
        }
        
        for(let k = 1; k < dots.length; k++) {
            dots[k].addEventListener("click", showDotsInformation);
        }
        
    }
    
    function changeDotsColor(e) {
        var answer,
            question,
            keyPair;
        
        question = e.target["__data__"]["data"]["question"];
        answer = e.target["__data__"]["data"]["answer"];
        
        resetDotsColor();
        resetInnerRingColor();
        selectDotsColor(keyPair, answer, question);
    }
    
    function resetDotsColor() {
        for(let i = 1; i < dots.length; i++) {
            dots[i].style = ("fill: rgb(20,20,100)");
        }
    }
    
    //reset Color of inner ring segments, when clicking on an answer, to avoid having the colored answers from clicking on a dot (answers given by the participant change to a different color and would retain that color instead of having the default colors for the corresponding questions and answers)
    function resetInnerRingColor() {
        var curQuestion,
            colorCounter = 0;
        
        for(let i = 0; i < innerRingSegments.length; i++) {
            if(innerRingSegments[i]["__data__"]["data"]["question"] === curQuestion) {
                innerRingSegments[i].children[0].style.fill = colorRange[colorCounter];
            } else {
                if(curQuestion !== undefined) {
                    colorCounter++;
                }
                innerRingSegments[i].children[0].style.fill = colorRange[colorCounter];
            }
            curQuestion = innerRingSegments[i]["__data__"]["data"]["question"];
        }
    }
    
    //nur wenn Antwort und Frage übereinstimmen
    function selectDotsColor(keyPair, answer, question) {
        for(let i = 1; i < dots.length; i++) {
            keyPair = dots[i]["__data__"]["data"];
            for (let key in keyPair){
                if (answer === keyPair[key] && key === question) {
                    dots[i].style = ("fill: rgb(0,80,250)");
                }
            }
        }
    }
    
    function showOuterRingInformation(e) {
        outerInfoText.innerHTML = "<br>" + e.target["__data__"]["data"];
    }
    
    function removeOuterRingInformation(e) {
        outerInfoText.innerHTML = "";
    }
    
    function showInnerRingInformation(e) {
        innerInfoText.innerHTML = "<br>" + e.target["__data__"]["data"]["answer"] + " <br> (" + (e.target["__data__"]["data"]["value"] / 856 * 100) + "%)";
        outerInfoText.innerHTML = "<br>" + e.target["__data__"]["data"]["question"];
    }
    
    function removeInnerRingInformation(e) {
        innerInfoText.innerHTML = "";
        outerInfoText.innerHTML = "";
    }
    
    //when hovering over a dot, the answers to the question from the participant appear in the info box
    function showDotsInformation(e) {
        var dotsData,
            ringAnswers,
            tempColor;
        
        //saves the data of the dot temporarily on hover
        dotsData = e.target["__data__"]["data"];
        ringAnswers = document.querySelectorAll(".inner");
        tempColor = document.querySelectorAll(".tempColor");
        
        
        //reset the style of the inner ring segments
        for (let j = 0; j < tempColor.length; j++) {
            tempColor[j].style.fill = colorInformation[j];
            
            tempColor[j].classList.remove("tempColor");
        }
        
        colorInformation = [];
        
        //iterate through the object for every key (question) except the participant ID 
        for(let key in dotsData) {
            if(key === "value"){
                continue;
            }
            
            for(let i = 0; i < ringAnswers.length; i++) {
                var question = ringAnswers[i]["__data__"]["data"]["question"],
                    answer = ringAnswers[i]["__data__"]["data"]["answer"],
                    segment = ringAnswers[i].children[0];
                
                if(question === key && answer === dotsData[key]) {
                    colorInformation.push(segment.style.fill);
                    
                    segment.style.fill = "rgb(0,0,80)";
                    segment.classList.add("tempColor");
                }
            }
        }
        showSelectedParticipant(e.target);
    }
    
    function showSelectedParticipant(test) {
        for(let i = 1; i < dots.length; i++) {
            if(dots[i] === test) {
                dots[i].style.fill = "rgb(0,80,250)";
            } else {
                dots[i].style.fill = "rgb(20,20,100)";
            }
        }        
    }
    
   
    that.setupEventListeners = setupEventListeners;
    return that;
};