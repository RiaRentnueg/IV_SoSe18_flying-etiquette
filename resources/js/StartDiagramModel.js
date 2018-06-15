/* eslint-env browser */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette.StartDiagramModel = function() {
    "use strict";

    var that = {},
        dotsData = [],
        tempData = [],
        currData = [],
        container = {},
        columnsData = [];

    function setupCsvData() {
        d3.csv("./data/flying-etiquette.csv", function(data) {
            dotsData = data;
            //this loop saves all answers form the dataset into a temporary array that can then be sorted and provide the output we need, the first column of the data is an id which is irrelevant at this point, so the loop starts at 1
            for(let i = 1; i < data.columns.length; i++){
                //this saves the data needed for the outer ring in a seperate array
                columnsData.push(data.columns[i]);
                for(let j = 0; j < data.length; j++){
                    tempData.push(data[j][data.columns[i]]);
                }
                countArrayElements(tempData, data.columns[i]);
                tempData = [];
            }
        });
    }
    
    function getInnerRingData() {
        return currData;
    }
    
    function getOuterRingData() {
        return columnsData;
    }
    
    function getDotsData() {
        return dotsData;
    }
    
    function countArrayElements(array, questionName) {
        var current = null,
            count = 0;
        
        //sorts the elements in the array so that the same answers from the csv file are grouped together
        array.sort();
        //now the function goes through the array and counts the amount of same answers until a different one appears, the important data is being saved in a container and the new answer is now the current answer until a different one is selected again
        for(let i = 0; i < array.length; i++) {
            if (array[i] != current) {
                if (count > 0) {
                    setupContainer(questionName, current, count);
                }
                current = array[i];
                count = 1;
            } else {
                count++;
            }
        }
        //this regards the last set of answers
        if (count > 0) {
            setupContainer(questionName, current, count);
        }
    }
    
    //the question, the answer and the amount of the answers is being saved in an object container and then pushed into an array, which later contains every answer and the amount these answers have been given, the container is then being emptied so that a new set of data can be pushed into the array
    function setupContainer(question, answer, value) {
        container.question = question;
        container.answer = answer;
        container.value = value;
        currData.push(container);
        container = {};
    }
    
    that.setupCsvData = setupCsvData;
    that.getInnerRingData = getInnerRingData;
    that.getOuterRingData = getOuterRingData;
    that.getDotsData = getDotsData;
    return that;
};
