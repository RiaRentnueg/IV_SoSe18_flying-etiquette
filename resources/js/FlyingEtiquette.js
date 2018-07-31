/* eslint-env browser */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette = (function() {
    "use strict";
    
    var that = {};
    
    //initialize the script for the index file and the containers for the startDiagram
    function init() {
        var startDiagramBox = document.querySelector(".startDiagramBox"),
            startDiagramSvg = document.querySelector(".startDiagram");
        
        initStartDiagram(startDiagramBox, startDiagramSvg);
    }
    
    //initialize the start diagram inside the startDiagramManager, which handles the visual representation of the diagram with d3 and is therefore the central component of the code for the start diagram
    function initStartDiagram(diagramBox, diagramSvg) {
        var startDiagramManager = new FlyingEtiquette.StartDiagramManager(diagramBox, diagramSvg);
        
        startDiagramManager.setupStartDiagram();
    }
    
    that.init = init;
    return that;
    }());