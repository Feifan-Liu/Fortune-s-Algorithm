import point from "./Point.js";

function vdedge(p1, p2) {
	this.repeat = point.isSamePoint(p1,p2);
    this.points = [];
    this.points[0] = p1;
    this.points[1] = p2;
}

vdedge.prototype.equals = function(obj) {
    if(!(obj instanceof vdedge) || this.repeat || obj.repeat)
        return false;
    for(var i=0;i<2;i++){
        var same = false;
        for(var j=0;j<2;j++){
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

export default vdedge;