
 import point from "./Point.js"
 import circle from "./circle.js"
import vdedge from "./vdedge.js";
import BinaryHeap from "./maxheap.js"
 
 //draw (len) random points of (range) with (attr) on brd, concate new points to current point set 
 function drawRandomPoints(len, brd, attr, range){
	if(len <= 0) return;
	range = (typeof range !== 'undefined') ?  range :  [-10, 10, 10, -10];
	var p = [];
	var i;
	for (i=0;i<len;i++){
		p[i] = brd.create('point',[Math.random() * (range[1] - range[0]) + range[0], Math.random() * (range[3] - range[2]) + range[2]],attr);
		p[i].isDraggable = false;
	}
	points = points.concat(p);
	return p;
 }
 
 //draw parabolas on brd base on points in p and line mp
 function drawParabolas(p, brd){
	 p.forEach(function (value) {
	  	var pra = board.create('functiongraph', [function(x){return parabola(value, x);}],{dash:2});
		if(!showPara) pra.hideElement();
		parabolas.push(pra);
	 }); 
 }
 
 function parabola(p1, x) { //site and x coordinate
 	var y1 = p1.Y();
	var x1 = p1.X();
	var l = mp.Y();
	if(y1 > l)
	  return 1/(2*(y1 - l))*(Math.pow((x - x1),2) + Math.pow(y1, 2) - Math.pow(l, 2));
	else
	  return Number.POSITIVE_INFINITY;
 }
 
 function hideAllParabolas(){
	 showPara = false;
	 parabolas.forEach(function (value) {
	  	value.hideElement();
	 }); 
 }
 
 function showAllParabolas(){
	 showPara = true;
	 parabolas.forEach(function (value) {
	  	value.showElement();
	 }); 
 }
 
 function onclickGenerate(){
	 var number = document.getElementById("pointNumber").value;
     drawParabolas(drawRandomPoints(number, board, attr), board);
 }
 

 function drawHorizontalLine(Y){
	if(finishClicked) return;
	 var line = board.create('line',[[1,Y],[2,Y]], {straightFirst:true, straightLast:true, strokeWidth:1, strokeColor: "green"});
	 mapYtoLine.put(Y, line);
 }
 
 function removeHorizontalLine(Y){
	 var line = mapYtoLine.get(Y);
	 if(line != null)
	 	line.hideElement();
 }
 
 function onclickFinish(){
	finishClicked = true;
	var element = document.getElementById("stepBtn");
	element.setAttribute("disabled", "");
	element.className = element.className.replace(/\bbtn-primary\b/g, "btn-secondary");
	
	element = document.getElementById("finishBtn");
	element.setAttribute("disabled", "");
	element.className = element.className.replace(/\bbtn-primary\b/g, "btn-secondary");
	
	 while(!algFinished)
		onclickNextStep();
	
 }
 
 function onclickAnimation(){
	 if(animated){ 
	 	document.getElementById("animationBtn").innerHTML = "Animation: OFF";
	 	animated = false;
	 }
	 else{ 
		document.getElementById("animationBtn").innerHTML = "Animation: ON";
	 	animated = true;
	 }
 }
 
 function onclickStart(){
	 if(startClicked) return;
	 startClicked = true;
	 mp.moveTo([1,15]);
	 for(var pt of points){
		var ptclass = new point(pt.X(),pt.Y(),true);
        EL.insert(ptclass);
    }
	 
	 var element = document.getElementById("stepBtn");
	 element.removeAttribute("disabled");
  	 element.className = element.className.replace(/\bbtn-secondary\b/g, "btn-primary");
	 
	 element = document.getElementById("finishBtn");
	 element.removeAttribute("disabled");
  	 element.className = element.className.replace(/\bbtn-secondary\b/g, "btn-primary");
	 
	 document.getElementById("generateBtn").setAttribute("disabled","");
	 
	 element = document.getElementById("resetLineBtn");
	 element.setAttribute("disabled","");
  	 element.className = element.className.replace(/\bbtn-warning\b/g, "btn-secondary");
 }
 
 function moveSweepline(toY){
	removeHorizontalLine(toY);
	if(finishClicked) return;
	var diff = Math.abs(toY - oldY);
	var runingTime = 300 * diff / 2;
	if(animated) mp.moveTo([1,toY], runingTime);
	else  mp.moveTo([1,toY]);
	oldY = toY;
	return runingTime;
 }
 
 //add one point pt [x, y]
 function addPoint(pt, brd){
	 brd.create('point',pt,{
		fillColor: "red",
		strokeColor: "red",
		withLabel: false
		//size: 2,
		//face:'<>'
	 });
 }
 
 function addEdge(point1, point2){
	 var edgeAttr = {straightFirst:false, straightLast:false, strokeWidth:2, strokeColor:'black'};
	 var li3 = board.create('line',[[point1[0],point1[1]],[point2[0],point2[1]]], edgeAttr);
 }
 
 //draw a ray from point1 to point2 and start from point2
 function addRay(point1, point2){
	 var edgeAttr = {straightFirst:false, straightLast:true, strokeWidth:2, strokeColor:'black'};
	 var end0 = 2 * point2[0] - point1[0], end1 = 2 * point2[1] - point1[1];
	 board.create('line',[point2,[end0, end1]], edgeAttr);
 }
 
 function onclickNextStep(){
	if(EL.size() > 0){
		var pt = EL.removeHead();
		if(removed.containsKey(pt)){
			onclickNextStep();
			return;
		}
		var line = pt.line;
		moveSweepline(line);
		var index = -1;
        if(pt.isSite){
            if(SS.length == 0){
                SS.push(pt);
            }else{
                index = BSarc(SS,0,SS.length,pt.x,line);
				var above = SS[index];
				var intersec = above.pointInpara(pt.x,line);
				vde.put(new vdedge(pt,above),[intersec]);
                if(index > 0 && index < SS.length - 1 && !point.isSamePoint(SS[index-1],SS[index+1])){
					var center = map.get(new circle(SS[index-1],above,SS[index+1]));
					if(center != null){
						// console.log("remove",center,center.y - center.line);
						removed.put(center,"");
						removeHorizontalLine(center.line);
					}
                }
                SS.splice(index,0,above,pt);
				index++;
				// console.log(SS,index);
				if(index > 1 && !map.containsKey(new circle(SS[index-2],SS[index-1],SS[index]))){
					var center = point.center(SS[index-2],SS[index-1],SS[index]);
					// console.log("left",center,center.y - center.line,center.line < line);
					if(center.line < line && center.x < pt.x){
						// console.log("left in");
						EL.insert(center);
						map.put(new circle(SS[index-2],SS[index-1],SS[index]),center);
						drawHorizontalLine(center.line);
					}
				}
				if(index < SS.length-2 && !map.containsKey(new circle(SS[index],SS[index+1],SS[index+2]))){
					var center = point.center(SS[index],SS[index+1],SS[index+2]);
					// console.log("right",center,center.y - center.line,center.line < line);
					if(center.line < line && center.x > pt.x){
						// console.log("right in");
						EL.insert(center);
						map.put(new circle(SS[index],SS[index+1],SS[index+2]),center);
						drawHorizontalLine(center.line);
					}
				}
            }
        }else{
			index = BScenter(SS,0,SS.length,pt.x,line);
			// console.log(index,pt);
			var ln = SS[index-1], md = SS[index], rn = SS[index+1];
			updateVertex([ln,md,rn],pt);
			if(index > 1 && index < SS.length-1 && !map.containsKey(new circle(SS[index-2],SS[index-1],SS[index+1]))){
				var yarr = [SS[index-2].y,SS[index-1].y,SS[index+1].y];
				var miny = Math.min(...yarr);
				var center = point.center(SS[index-2],SS[index-1],SS[index+1]);
				// console.log("vertex left",center,center.y - center.line,(yarr[0] == miny && center.x > SS[index-2].x) || (yarr[2] == miny && center.x < SS[index+1].x),center.line < line);
				if((yarr[0] == miny && center.x > SS[index-2].x) || (yarr[2] == miny && center.x < SS[index+1].x))
					if(center.line < line){
						EL.insert(center);
						map.put(new circle(SS[index-2],SS[index-1],SS[index+1]),center);
						drawHorizontalLine(center.line);
					}
			}
			if(index < SS.length-2 && index > 0 && !map.containsKey(new circle(SS[index-1],SS[index+1],SS[index+2]))){
				var yarr = [SS[index-1].y,SS[index+1].y,SS[index+2].y];
				var miny = Math.min(...yarr);
				var center = point.center(SS[index-1],SS[index+1],SS[index+2]);
				// console.log("vertex right",center,center.y - center.line,(yarr[0] == miny && center.x > SS[index-1].x) || (yarr[2] == miny && center.x < SS[index+2].x),center.line < line);
				if((yarr[0] == miny && center.x > SS[index-1].x) || (yarr[2] == miny && center.x < SS[index+2].x))
					if(center.line < line){
						EL.insert(center);
						map.put(new circle(SS[index-1],SS[index+1],SS[index+2]),center);
						drawHorizontalLine(center.line);
					}
			}

			if(index > 1){
				var center = map.get(new circle(SS[index-2],SS[index-1],SS[index]));
				if(center != null){
					// console.log("remove",center,center.y - center.line);
					removed.put(center,"");
					removeHorizontalLine(center.line);
				}
			}
			if(index < SS.length-2){
				var center = map.get(new circle(SS[index],SS[index+1],SS[index+2]));
				if(center != null){
					// console.log("remove",center,center.y - center.line);
					removed.put(center,"");
					removeHorizontalLine(center.line);
				}
			}
            SS.splice(index,1);
			// console.log(SS);
			VD.push(pt);
			addPoint([pt.x,pt.y],board);
        }
    }else{
		finishAlgo();
	}
 }

 function finishAlgo(){
	for(var entry of vde.entries()){
		var key = entry[0];
		var value = entry[1];
		if(value.length == 1){
			var p1 = key.points[0];
			var p2 = key.points[1];
			var inter;
			if(p1.y > p2.y){
				inter =  p1.pointInpara(p2.x,p2.y);
			}else{
				inter = p2.pointInpara(p1.x,p1.y);
			}
			addRay([inter.x,inter.y],[value[0].x,value[0].y]);
		}else{
			if(value[0].isVD && value[1].isVD){
				continue;
			}
			if(value[0].isVD){
				addRay([value[0].x,value[0].y],[value[1].x,value[1].y]);
			}else{
				addRay([value[1].x,value[1].y],[value[0].x,value[0].y]);
			}
		}
	}
	var element = document.getElementById("resetLineBtn");
		element.removeAttribute("disabled");
		element.className = element.className.replace(/\bbtn-secondary\b/g, "btn-warning");
	 
	element = document.getElementById("stepBtn");
		element.setAttribute("disabled", "");
		element.className = element.className.replace(/\bbtn-primary\b/g, "btn-secondary");

	element = document.getElementById("finishBtn");
		element.setAttribute("disabled", "");
		element.className = element.className.replace(/\bbtn-primary\b/g, "btn-secondary");
		
	algFinished = true;
 }

 function updateVertex(points,center){
	for(var i = 0; i < 3; i++){
		var p1 = points[i], p2 = points[(i+1)%3];
		var inter = vde.get(new vdedge(p1,p2));
		if(inter == null){
			inter = [center];
		}else{
			if(inter.length == 1){
				inter.push(center);
			}else if(inter.length == 2){
				if(!inter[0].isVD){
					inter[0] = center;
				}else if(!inter[1].isVD){
					inter[1] = center;
				}
			}
			addEdge([inter[0].x,inter[0].y],[inter[1].x,inter[1].y]);
		}
		vde.put(new vdedge(p1,p2),inter);
	}
 }

 function BSarc(arr,left,right,value,line){
    if(left >= right){
		// console.log(left);
        return left;
    }
    var li = Number.NEGATIVE_INFINITY,ri = Number.POSITIVE_INFINITY;
	var mid = left+Math.floor((right-left)/2);
	var arc = arr[mid];
	if(mid > 0 && mid < arr.length-1 && point.isSamePoint(arr[mid-1],arr[mid+1])){
		var temparr = point.paraIntersection(arr[mid-1],arc,line);
		li = temparr[0], ri = temparr[1];
	}else{
		if(mid > 0){
			var boundindex = arr[mid-1].y < arc.y ? 1 : 0;
			li = point.paraIntersection(arr[mid-1],arc,line)[boundindex];
		}
		if(mid < arr.length-1){
			var boundindex = arr[mid+1].y < arc.y ? 0 : 1;
			ri = point.paraIntersection(arc,arr[mid+1],line)[boundindex];
		}
	}
	// console.log(mid,li,ri);
    if(value > li && value <= ri){
		// console.log(mid);
        return mid;
    }
    if(value > ri){
        return BSarc(arr,mid+1,right,value,line);
    }else{
        return BSarc(arr,left,mid-1,value,line);
    }
}

function BScenter(arr,left,right,value,line){
    if(left >= right){
        return left;
    }
    var li = Number.NEGATIVE_INFINITY,ri = Number.POSITIVE_INFINITY;
    var mid = left+Math.floor((right-left)/2);
	var arc = arr[mid];
	if(mid > 0 && mid < arr.length-1 && point.isSamePoint(arr[mid-1],arr[mid+1])){
		var temparr = point.paraIntersection(arr[mid-1],arc,line);
		li = temparr[0], ri = temparr[1];
	}else{
		if(mid > 0){
			var boundindex = arr[mid-1].y < arc.y ? 1 : 0;
			li = point.paraIntersection(arr[mid-1],arc,line)[boundindex];
		}
		if(mid < arr.length-1){
			var boundindex = arr[mid+1].y < arc.y ? 0 : 1;
			ri = point.paraIntersection(arc,arr[mid+1],line)[boundindex];
		}
	}
	// console.log(mid,li,ri);
    if(point.xEqualwithEpsilon(li,value) && point.xEqualwithEpsilon(ri,value)){
        return mid;
    }else if(point.xEqualwithEpsilon(li,value)){
        return mid-1;
    }else if(point.xEqualwithEpsilon(ri,value)){
        return mid+1;
    }
    if(value > ri){
        return BScenter(arr,mid+1,right,value,line);
    }else{
        return BScenter(arr,left,mid-1,value,line);
    }
}
 
 var beachline;
 var points = [];
 var parabolas = [];
 var showPara = false;
 var startClicked = false;
 var SS = [];
 var EL = new BinaryHeap();
 var VD = [];
 var map = new Hashtable();
 var vde = new Hashtable();
 var removed = new Hashtable();
 var mapYtoLine = new Hashtable();
 var algFinished = false;
 var finishClicked = false;
 var animated = false;
 //var stepPosistions = [10,8,6,4,2,0,-2,-4,-6,-8,-10], currStep = 0;
 var attr = {
		fillColor: "black",
		strokeColor: "black",
		withLabel: false
	};
	
 var board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-12, 12, 12, -12], axis:false});
 
 document.getElementById("generateBtn").onclick = onclickGenerate;
 document.getElementById("option1").onclick = showAllParabolas;
 document.getElementById("option2").onclick = hideAllParabolas;
 document.getElementById("startBtn").onclick = onclickStart;
 document.getElementById("stepBtn").onclick = onclickNextStep;
 document.getElementById("finishBtn").onclick = onclickFinish;
 document.getElementById("animationBtn").onclick = onclickAnimation;
 document.getElementById("resetLineBtn").onclick = function(){mp.moveTo([0,0]);};
 
 //beachline, initialize only once because reference to points array
 board.create('functiongraph', [function(x){
		 var minimum = Number.POSITIVE_INFINITY;
		 points.forEach(function (value) {
			if(parabola(value, x) < minimum) minimum = parabola(value, x);
		 }); 
		 return minimum;}], {strokeColor:'red', strokeWidth:2});

 //initialize horizontal gdragable line
 var mp = board.create('point',[1,9],{name:"drag", withLabel: false, face:'o', size:8, strokeColor:'red', fillOpacity:0.6, strokeOpacity: 0.6});
 var horizontalLine = board.create('line',["drag",[20000,"Y(drag)"]], {straightFirst:true, straightLast:true, strokeWidth:1});
 var oldY = mp.Y();
 //drawParabolas(drawRandomPoints(10, board, attr), board);

 var getMouseCoords = function(e, i) {
        var cPos = board.getCoordsTopLeftCorner(e, i),
            absPos = JXG.getPosition(e, i),
            dx = absPos[0]-cPos[0],
            dy = absPos[1]-cPos[1];

        return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
    },
    down = function(e) {
        var canCreate = true, i, coords, el;

        if (e[JXG.touchProperty]) {
            // index of the finger that is used to extract the coordinates
            i = 0;
        }
        coords = getMouseCoords(e, i);

        for (el in board.objects) {
            if(JXG.isPoint(board.objects[el]) && board.objects[el].hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
                canCreate = false;
                break;
            }
        }
               
        if (canCreate) {
            var tmp = board.create('point', [coords.usrCoords[1], coords.usrCoords[2]], attr);
			tmp.isDraggable = false;
			points.push(tmp);
			var tmpArr = [tmp];
			drawParabolas(tmpArr, board);
        }
    };

 board.on('down', down);