import point from "./Point.js";

function circle(p1, p2, p3) {
	this.repeat = true;
    this.points = [];
    this.points[0] = p1;
    this.points[1] = p2;
    this.points[2] = p3;
	if(!point.isSamePoint(p1,p2) && !point.isSamePoint(p2,p3) && !point.isSamePoint(p1,p3)){
		this.repeat = false;
	}
}

circle.prototype.equals = function(obj) {
    if(!(obj instanceof circle) || this.repeat || obj.repeat)
        return false;
    for(var i=0;i<3;i++){
        var same = false;
        for(var j=0;j<3;j++){
            if(point.isSamePoint(this.points[i],obj.points[j])){
                same = true;
                break;
            }
        }
        if(!same)
            return false;
    }
    return true;
};

export default circle;