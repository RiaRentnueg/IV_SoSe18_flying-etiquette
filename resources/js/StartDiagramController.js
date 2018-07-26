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
      activeSegments = [],
      activeDot = [],
      colorRange = ["#1565C0", "#B71C1C", "#C62828", "#EF6C00", "#6A1B9A", "#7B1FA2", "#8E24AA", "#00838F", "#9E9D24", "#AFB42B", "#D32F2F", "#E53935", "#F44336", "#0097A7", "#00ACC1", "#C0CA33", "#CDDC39", "#F57C00", "#FB8C00", "#1B5E20", "#2E7D32", "#1976D2", "#1E88E5", "#2196F3", "#42A5F5", "#64B5F6"];
    
    function setupEventListeners() {
        dots = document.querySelectorAll(".participantDots");
        outerRingSegments = document.querySelectorAll(".outer");
        innerRingSegments = document.querySelectorAll(".inner");

        outerInfoText = document.querySelector(".outerInfoText");
        innerInfoText = document.querySelector(".innerInfoText");

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
        var keyPair;
        
        if(checkActiveOrInactive(e)){
            activeSegments.push(e.target);
        }
        
        resetDotsColor();
        resetInnerRingColor();
        markActiveSegments();
        selectDotsColor(keyPair);
                
    }
    
    //checks if the clicked on segment is active or inactive, a segment is active after the user clicked on it and the user can set it as inactive by clicking on it again, if the user clicks on an element and it is included in the activeSegments array this segment is no longer active and then removed from the array
    function checkActiveOrInactive(e){
        var active = true;
        for(let i = 0; i < activeSegments.length; i++) {
            if(activeSegments[i] === e.target && activeSegments.length !== 0) {
                activeSegments.splice(i, 1);
                active = false;
                break;
            }
        }
        return active;
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
    
    //currently active segments should be highlighted in a different color, the same color that is used for highlighting corresponding answers when clicking on a participant dot is also used here
    function markActiveSegments() {
        for(let i = 0; i < activeSegments.length; i++) {
            activeSegments[i].style.fill = "rgb(0,0,80)";
        }
    }
    
    //only highlight a dot when the answer belongs to the right question, because there are multiple answers that consist of the same words but belong to different questions
    function selectDotsColor(keyPair) {
        var tempActiveDot = [];
        activeDot = [];
        
        for(let j = 0; j < activeSegments.length; j++) {
            
            if (j === 0) {
                for(let i = 1; i < dots.length; i++) {
                    keyPair = dots[i]["__data__"]["data"];

                    for (let key in keyPair){
                        if (activeSegments[j]["__data__"]["data"]["answer"] === keyPair[key] && key === activeSegments[j]["__data__"]["data"]["question"]) {
                            activeDot.push(dots[i]);
                        }
                    }
                }
                
            } else {
                for(let k = 0; k < activeDot.length; k++) {
                    keyPair = activeDot[k]["__data__"]["data"];
                    
                    for (let key in keyPair){
                        if (activeSegments[j]["__data__"]["data"]["answer"] === keyPair[key] && key === activeSegments[j]["__data__"]["data"]["question"]) {
                            tempActiveDot.push(activeDot[k]);
                        }
                    }
                }
                activeDot = tempActiveDot;
                tempActiveDot = []
            }
        }
        
        for(let h = 0; h < activeDot.length; h++) {
            activeDot[h].style = ("fill: rgb(0,80,250)");
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
        
        activeSegments = [];
        resetInnerRingColor();
        
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
                    
                    segment.style.fill = "rgb(0,0,80)";
                    segment.classList.add("tempColor");
                }
            }
        }
        showSelectedParticipant(e.target);
    }
    
    //show only the participant dot that the user clicked on
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