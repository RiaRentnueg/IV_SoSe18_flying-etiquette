/* eslint-env browser */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette.StartDiagramController = function() {
    "use strict";

    var that = {},
      manager,
      dots,
      innerRingSegments,
      outerRingSegments,
      outerInfoText,
      innerInfoText,
      activeSegments = [],
      activeDot = [];
    
    function setupEventListeners() {
        manager = FlyingEtiquette.StartDiagramManager();
        
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
        
        if(checkActiveOrInactive(e)){
            activeSegments.push(e.target);
        }
        
        resetDotsColor();
        resetInnerRingColor();
        markActiveSegments();
        selectDotsColor();
                
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
            manager.colorInactiveDot(dots[i]);
        }
    }
    
    //reset Color of inner ring segments, when clicking on an answer, to avoid having the colored answers from clicking on a dot (answers given by the participant change to a different color and would retain that color instead of having the default colors for the corresponding questions and answers)
    function resetInnerRingColor() {
        var curQuestion,
            colorCounter = 0;
        
        for(let i = 0; i < innerRingSegments.length; i++) {
            if(innerRingSegments[i]["__data__"]["data"]["question"] === curQuestion) {
                manager.reassignRingColor(innerRingSegments[i], colorCounter);
            } else {
                if(curQuestion !== undefined) {
                    colorCounter++;
                }
                manager.reassignRingColor(innerRingSegments[i], colorCounter);
            }
            curQuestion = innerRingSegments[i]["__data__"]["data"]["question"];
        }
    }
    
    //currently active segments should be highlighted in a different color, the same color that is used for highlighting corresponding answers when clicking on a participant dot is also used here
    function markActiveSegments() {
        for(let i = 0; i < activeSegments.length; i++) {
            manager.colorActiveSegment(activeSegments[i]);
        }
    }
    
    //only highlight a dot when the answer belongs to the right question, because there are multiple answers that consist of the same words but belong to different questions
    function selectDotsColor() {
        var tempActiveDot = [];
        activeDot = [];
        
        for(let i = 0; i < activeSegments.length; i++) {
            if (i === 0) {
                setUpDotsArray(dots,activeDot,i);
            } else {
                setUpDotsArray(activeDot,tempActiveDot,i);
                
                activeDot = tempActiveDot;
                tempActiveDot = [];
            }
        }
        
        highlightActiveDots();
        
    }
    
    function highlightActiveDots() {
        for(let i = 0; i < activeDot.length; i++) {
            manager.colorActiveDot(activeDot[i]);
        }
    }
    
    function setUpDotsArray(initialCollection,newCollection,iteration) {
        var keyPair,
            answer,
            question;
        
        for(let i = 1; i < initialCollection.length; i++) {
            keyPair = initialCollection[i]["__data__"]["data"];
            answer = activeSegments[iteration]["__data__"]["data"]["answer"];
            question = activeSegments[iteration]["__data__"]["data"]["question"];

            for (let key in keyPair){
                if (answer === keyPair[key] && key === question) {
                    newCollection.push(initialCollection[i]);
                }
            }
        }
    }

    function showOuterRingInformation(e) {
        manager.setOuterRingHoverText(outerInfoText, e);
    }
    
    function removeOuterRingInformation(e) {
        manager.removeOuterRingHoverText(outerInfoText);
    }
    
    function showInnerRingInformation(e) {
        manager.setInnerRingHoverText(innerInfoText, outerInfoText, e);
    }
    
    function removeInnerRingInformation(e) {
        manager.removeInnerRingHoverText(innerInfoText, outerInfoText);
    }
    
    //when hovering over a dot, the answers to the question from the participant appear in the info box
    function showDotsInformation(e) {
        var dotsData,
            ringAnswers;
        
        //saves the data of the dot temporarily on hover
        dotsData = e.target["__data__"]["data"];
        ringAnswers = document.querySelectorAll(".inner");
        
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
                    manager.colorActiveSegment(segment);
                }
            }
        }
        showSelectedParticipant(e.target);
    }
    
    //show only the participant dot that the user clicked on
    function showSelectedParticipant(clickedDot) {
        for(let i = 1; i < dots.length; i++) {
            if(dots[i] === clickedDot) {
                manager.colorActiveDot(dots[i]);
            } else {
                manager.colorInactiveDot(dots[i]);
            }
        }        
    }
    

    that.setupEventListeners = setupEventListeners;
    return that;
};