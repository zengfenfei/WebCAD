/**
 * this is the script file for other scripts to run correctlly
 * www.hc.com; hc:homeof cloud, ws:webscript
 */

/**
 * declaring namespace, eg. package('com.hc.graphic'); lick package java.util in Java
 */
function package(ns){
		var na=ns.split('.');	//names array
		var prv=window;
		for(var i=0;i<na.length;i++){
			if(!prv[na[i]])
				prv[na[i]]={};
			prv=prv[na[i]];
		}
}

package('hc.geom');
//calculate distance
hc.geom.dist=function(p1,p2){//console.log(p1,p2);
	return Math.sqrt(Math.pow(p1.x-p2.x, 2)+Math.pow(p1.y-p2.y, 2));
};

/*
function Matrix(m){
	this.matrix=m;
	this.multiply=function(m2){
		var m1=this.matrix;
		m2=m2.matrix;
		this.matrix=[];
		for(var i=0;i<m1.length;i++){
			for(var j=0;j<m2[0].length;j++){
				this.matrix[i][j]=0;
				for(var k=0;k<m2[0].length;k++){
					this.matrix[i][j]+=m1[i][k]*m2[k][j];
				}
			}
		}
	};
}*/