

var s = 600
var solGrid = [] // Store the answer here
var displayGrid = [] // what is shown on screen
var displayCols = [] // the colors to show (currently 155 for undef, 255 for white and 0 for black)
let gridBounds = {tlx: 100, tly: 50, side: 400}
var hw = 4 // size of the square grid
var squareSize
var paintCol = 0
var dragging = false
var clickStart = []
var neqList = []
var eqList = []
var showSol = false
var buttons = []
var fakeKey
var mx = 0
var my = 0
var status = 'paint'
var randomS

function setup() {
	let para = getURLParams()
	let pnum = para.puzzle
	hw = para.size ? floor(para.size) : 4
	squareSize = gridBounds.side/hw
	randomS = pnum? pnum : floor(Math.random()*9999999)
	randomSeed(randomS)
	if (!pnum) {
	window.location.href = 'https://shminge.github.io/kzp/?puzzle='+randomS
	}
	
	//noLoop()
	createCanvas(s,s-40);
	generateGrid(); 	
	textFont('Times New Roman')
	textAlign(CENTER, CENTER);
	textSize(30)
}

function draw() {
	background(240,226,182)


	
	
	
		for (let i = 0; i < hw; i++){
			for(let j = 0; j < hw; j++){
				push()
					fill(displayCols[i][j])
					square(gridBounds.tlx+j*squareSize,gridBounds.tly+i*squareSize,squareSize)
					showSol? fill(255*solGrid[i][j],0,255*(1-solGrid[i][j])) : fill(100)
					text(displayGrid[i][j],gridBounds.tlx+(j+0.5)*squareSize,gridBounds.tly+(i+0.5)*squareSize)
				pop()
			}
		}
	
	
	push()
		fill(0)
		if (paintCol == 0) {stroke('aqua'); strokeWeight(3)}
		rect(5,gridBounds.tly,gridBounds.tlx-10,gridBounds.side)
	pop()
	push()
		fill(255)
		if (paintCol == 255) {stroke('aqua'); strokeWeight(3)}
		rect(gridBounds.tlx+gridBounds.side+5,gridBounds.tly,(s-gridBounds.tlx-gridBounds.side)-10,gridBounds.side)
	pop()
	push()
		fill(155)
		if (paintCol == 155) {stroke('aqua'); strokeWeight(3)}
		rect(5,5,s-10,gridBounds.tly-10)
	pop()
	push()
	if (showSol){stroke('aqua'); strokeWeight(3)}
	rect(gridBounds.tlx + 5, gridBounds.tly + gridBounds.side + 10, squareSize-10, squareSize-10)
	b = {tlx: gridBounds.tlx + 5, tly: gridBounds.tly + gridBounds.side + 10, width: squareSize-10, height: squareSize-10, button: 0}
	buttons[0] = b
	ellipse(b.tlx + b.width/2, b.tly + b.height/2, b.width - 5, b.height/2)
	fill('black')
	ellipse(b.tlx + b.width/2, b.tly + b.height/2, b.width/3, b.height/2)
	pop()
	
	push()
	rect(gridBounds.tlx + 5 + squareSize, gridBounds.tly + gridBounds.side + 10, squareSize-10, squareSize-10)
	b = {tlx: gridBounds.tlx + 5 + squareSize, tly: gridBounds.tly + gridBounds.side + 10, width: squareSize-10, height: squareSize-10, button: 1}
	buttons[1] = b
	strokeWeight(5)
	stroke('red')
	line(b.tlx + 15, b.tly + 15, b.tlx + b.width - 15, b.tly + b.height - 15)
	line(b.tlx + b.width - 15, b.tly + 15, b.tlx + 15, b.tly + b.height - 15)
	pop()
	push()
	if (status == 'eq'){stroke('aqua'); strokeWeight(3)}
	rect(gridBounds.tlx + 5 + squareSize*2, gridBounds.tly + gridBounds.side + 10, squareSize-10, squareSize-10)
	b = {tlx: gridBounds.tlx + 5 + squareSize*2, tly: gridBounds.tly + gridBounds.side + 10, width: squareSize-10, height: squareSize-10, button: 2}
	buttons[2] = b
	strokeWeight(5)
	stroke('green')
	line(b.tlx + 15, b.tly + 2*b.height / 5, b.tlx + b.width - 15, b.tly + 2*b.height/5)
	line(b.tlx + 15, b.tly + 3*b.height / 5, b.tlx + b.width - 15, b.tly + 3*b.height/5)
	pop()
	push()
	if (status == 'neq'){stroke('aqua'); strokeWeight(3)}
	rect(gridBounds.tlx + 5 + squareSize*3, gridBounds.tly + gridBounds.side + 10, squareSize-10, squareSize-10)
	b = {tlx: gridBounds.tlx + 5 + squareSize*3, tly: gridBounds.tly + gridBounds.side + 10, width: squareSize-10, height: squareSize-10, button: 3}
	buttons[3] = b
	strokeWeight(5)
	stroke('rgb(167,0,0)')
	line(b.tlx + 15, b.tly + 2*b.height / 5, b.tlx + b.width - 15, b.tly + 2*b.height/5)
	line(b.tlx + 15, b.tly + 3*b.height / 5, b.tlx + b.width - 15, b.tly + 3*b.height/5)
	line(b.tlx + b.width/2 + 15, b.tly + 15, b.tlx + b.width/2 - 15, b.tly + b.height - 15)
	pop()
	
	if(clickStart.length){
		push()
			noFill()
			stroke('red')
			strokeWeight(3)
			square(gridBounds.tlx+clickStart[0]*squareSize,gridBounds.tly+clickStart[1]*squareSize,squareSize)
		pop()
	}
	push()
	noFill()
	stroke('red')
	for (let neq of neqList){
		line(gridBounds.tlx+neq[0]*squareSize+squareSize/2,gridBounds.tly+neq[1]*squareSize+squareSize/2,gridBounds.tlx+neq[2]*squareSize+squareSize/2,gridBounds.tly+neq[3]*squareSize+squareSize/2)
	}
	pop()
	push()
	noFill()
	stroke('green')
	for (let eq of eqList){
		line(gridBounds.tlx+eq[0]*squareSize+squareSize/2,gridBounds.tly+eq[1]*squareSize+squareSize/2,gridBounds.tlx+eq[2]*squareSize+squareSize/2,gridBounds.tly+eq[3]*squareSize+squareSize/2)
	}
	pop()
}




function generateGrid(){
	solGrid = [] // reset
	displayCols = []
	for (let i = 0; i < hw; i++){
		solGrid.push([])
		displayCols.push([])
		for(let j = 0; j < hw; j++){
			solGrid[i].push(random([0,1]))
			displayCols[i].push(155)
		}
	}
	
	
	// gen the display grid
	displayGrid = []
		for (let i = 0; i < hw; i++){
			displayGrid.push([])
			for(let j = 0; j < hw; j++){
				// loop over each grid cell
				let t = 0
				let s = 0
				for(let dx = -1; dx < 2; dx++){
					for (let dy = -1; dy < 2; dy++){
						if(i+dy >= 0 && i+dy < hw && j+dx >= 0 && j+dx < hw){ 
							t++
							s += solGrid[i+dy][j+dx]
						}
					}
				}
				displayGrid[i].push(s > t/2 ? t - s : s) // push the lower option
				
		}
	}
}


function mousePressed(){
	mx = mouseX
	my = mouseY
	
	if (my < gridBounds.tly && my >= 0){
		paintCol = 155
	}
	
	
	
	if (my >= gridBounds.tly && my <= gridBounds.tly + gridBounds.side){
		// clicked in grid height
		if(mx >= gridBounds.tlx && mx <= gridBounds.tlx + gridBounds.side){
			// clicked inside the grid area

			// find displacement
			let dispX = mx-gridBounds.tlx
			let dispY = my-gridBounds.tly

			let gX = floor(dispX/squareSize)
			let gY = floor(dispY/squareSize)
			
			if (status == 'paint'){
				displayCols[gY][gX] = paintCol // paint the cell
			}
		}
		
		if(mx < gridBounds.tlx && mx >= 0){
			paintCol = 0
		} else if (mx > gridBounds.tlx + gridBounds.side && mx <= s) {
			paintCol = 255
		}
	}
	
		
	if (status == 'eq') {
			fakeKey = 'e'
			update()
			fakeKey = undefined
	}
	
	if (status == 'neq'){
			fakeKey = 'q'
			update()
			fakeKey = undefined
	}
	
	for (let button of buttons) {
		if (mx > button.tlx && mx < button.tlx + button.width && my > button.tly && my < button.tly + button.height){
			if (button.button == 0){
				showSol = !showSol
			}
			if (button.button == 1){
				eqList = []
				neqList = []
				dragging = false
				clickStart = []
			}
			if (button.button == 2) {
				status = 'eq'
			}
			if (button.button == 3){
				status = 'neq'
			}
		}
	}
	
}


function keyTyped(){
		mx = mouseX
		my = mouseY
		fakeKey = key
		update()
		fakeKey = undefined
}

function update(){
		if (dragging) {
		if (fakeKey == 'q'){
			if(mx >= gridBounds.tlx && mx <= gridBounds.tlx + gridBounds.side && my >= gridBounds.tly && my <= gridBounds.tly + gridBounds.side){
				dragging = true
				// find displacement
				let dispX = mx-gridBounds.tlx
				let dispY = my-gridBounds.tly

				let gX = floor(dispX/squareSize)
				let gY = floor(dispY/squareSize)
				
				if (abs(gX-clickStart[0])<=1 && abs(gY-clickStart[1])<=1 && abs(gX-clickStart[0]) + abs(gY-clickStart[1])>0) {
					// if touching
					neqList.push([lerp(gX,clickStart[0],0.4),lerp(gY,clickStart[1],0.4),lerp(gX,clickStart[0],0.6),lerp(gY,clickStart[1],0.6)])
					dragging = false
					clickStart = []
					status = 'paint'
				} else {
					dragging = false
					clickStart = []
					status = 'paint'
				}
			}
			
		} else if (fakeKey == 'e'){
			if(mx >= gridBounds.tlx && mx <= gridBounds.tlx + gridBounds.side && my >= gridBounds.tly && my <= gridBounds.tly + gridBounds.side){
				dragging = true
				// find displacement
				let dispX = mx-gridBounds.tlx
				let dispY = my-gridBounds.tly

				let gX = floor(dispX/squareSize)
				let gY = floor(dispY/squareSize)
				
				if (abs(gX-clickStart[0]) + abs(gY-clickStart[1])<=2 && abs(gX-clickStart[0]) + abs(gY-clickStart[1])>0) {
					// if touching
					eqList.push([lerp(gX,clickStart[0],0.4),lerp(gY,clickStart[1],0.4),lerp(gX,clickStart[0],0.6),lerp(gY,clickStart[1],0.6)])
					dragging = false
					clickStart = []
					status = 'paint'
				} else {
					dragging = false
					clickStart = []
					status = 'paint'
				}
			}
		}
		
		
		
	} else {
			if(mx >= gridBounds.tlx && mx <= gridBounds.tlx + gridBounds.side && my >= gridBounds.tly && my <= gridBounds.tly + gridBounds.side){
				dragging = true
				// find displacement
				let dispX = mx-gridBounds.tlx
				let dispY = my-gridBounds.tly

				let gX = floor(dispX/squareSize)
				let gY = floor(dispY/squareSize)
				
				clickStart = [gX,gY]
			}
	}
	if (fakeKey == 'x'){
		eqList = []
		neqList = []
		dragging = false
		clickStart = []
	}
	
	
	if (fakeKey == "p") {
		showSol = showSol? false : true
	}
		
}
