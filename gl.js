const ATTR_POSITION_NAME	= "a_position";
const ATTR_POSITION_LOC		= 0;
const ATTR_NORMAL_NAME		= "a_norm";
const ATTR_NORMAL_LOC		= 1;
const ATTR_UV_NAME			= "a_uv";
const ATTR_UV_LOC			= 2;


//create custom gl context
function GLInstance(canvasId){
	var canvas=document.getElementById(canvasId),
		gl=canvas.getContext('webgl2');

	if(!gl){
		console.error('webgl context is not available');
		return null;
	}
	gl.mMeshCache=[];

	gl.clearColor(1.0,1.0,1.0,1.0);

	gl.fClear=function(){
		this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
		return this;		
	}

	// create and fill array buffer
	gl.fCreateArrayBuffer=function(floatArray,isStatic){
		if(isStatic==undefined) isStatic=true;
		var buf=this.createBuffer();
		this.bindBuffer(this.ARRAY_BUFFER,buf);
		this.bufferData(this.ARRAY_BUFFER,floatArray,(isStatic) ? this.STATIC_DRAW:this.DYNAMIC_DRAW );
		this.bindBuffer(this.ARRAY_BUFFER,null);
		return buf;
	}

	// turns arrays into gl buffers,then setup a vao that will predefine the buffers to standard shader attributes
	gl.fCreateMeshVAO=function(name,aryInd,aryVert,aryNorm,aryUV){
		var rtn={
			drawMode:this.TRIANGLES
		}

		rtn.vao=this.createVertexArray();
		this.bindVertexArray(rtn.vao);

		//set up vertices
		if(aryVert!==undefined && aryVert!=null){
			rtn.bufVertices=this.createBuffer();
			rtn.vertexComponentLen=3;
			rtn.vertexCount=aryVert.length/rtn.vertexComponentLen;

			this.bindBuffer(this.ARRAY_BUFFER,rtn.bufVertices);
			this.bufferData(this.ARRAY_BUFFER,new Float32Array(aryVert),this.STATIC_DRAW);
			this.enableVertexAttribArray(ATTR_POSITION_LOC);
			this.vertexAttribPointer(ATTR_POSITION_LOC,3,this.FLOAT,false,0,0);			
		}
		// set up normals
		if(aryNorm!==undefined && aryNorm!=null){
			rtn.bufNormals=this.createBuffer();
			this.bindBuffer(this.ARRAY_BUFFER,rtn.bufNormals);
			this.bufferData(this.ARRAY_BUFFER,new Float32Array(aryNorm),this.STATIC_DRAW);
			this.enableVertexAttribArray(ATTR_NORMAL_LOC);
			this.vertexAttribPointer(ATTR_NORMAL_LOC,3,this.FLOAT,false,0,0);

		}	

		//Setup UV
		if(aryUV !== undefined && aryUV != null){
			rtn.bufUV = this.createBuffer();
			this.bindBuffer(this.ARRAY_BUFFER, rtn.bufUV);
			this.bufferData(this.ARRAY_BUFFER, new Float32Array(aryUV), this.STATIC_DRAW);
			this.enableVertexAttribArray(ATTR_UV_LOC);
			this.vertexAttribPointer(ATTR_UV_LOC,2,this.FLOAT,false,0,0);	//UV only has two floats per component
		}

		//.......................................................
		//Setup Index.
		if(aryInd !== undefined && aryInd != null){
			rtn.bufIndex = this.createBuffer();
			rtn.indexCount = aryInd.length;
			this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, rtn.bufIndex);
			this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryInd), this.STATIC_DRAW);
			this.bindBuffer(this.ELEMENT_ARRAY_BUFFER,null);
		}//

		// clean up
		this.bindVertexArray(null);
		this.bindBuffer(this.ARRAY_BUFFER,null);
		this.mMeshCache[name]=rtn;
		return rtn;

	}

	// setters and getters
	gl.fSetSize=function(w,h){
		this.canvas.style.width=w+'px';
		this.canvas.style.height=h+'px';
		this.canvas.width=w;
		this.canvas.height=h;

		this.viewport(0,0,w,h);
		return this;

	}

	return gl;


}