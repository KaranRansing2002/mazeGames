const canvas=document.getElementById('canvas')
const ctx=canvas.getContext('2d');


let grid=[];
let size=600;
let rows=60;
let cols=60;
let cellSize=size/rows;
let currentCell;
let stack=[];

class Cell{
    constructor(rownum,colnum){
        this.rownum=rownum;
        this.colnum=colnum;
        this.walls={
            left : true,
            right : true,
            bottom : true,
            top : true
        }
        this.visited=false;
    }
    drawLeftWall(){
        ctx.beginPath();
        let x=this.colnum*cellSize
        let y=this.rownum*cellSize
        ctx.moveTo(x,y);
        ctx.lineTo(x,y+size/rows);
        ctx.stroke();
    }
    drawRightWall(){
        ctx.beginPath();
        let x=this.colnum*cellSize
        let y=this.rownum*cellSize
        ctx.moveTo(x+size/cols,y);
        ctx.lineTo(x+size/cols,y+size/rows);
        ctx.stroke();
    }
    drawBottomWall(){
        ctx.beginPath();
        let x=this.colnum*cellSize
        let y=this.rownum*cellSize
        ctx.moveTo(x,y+size/rows);
        ctx.lineTo(x+size/cols,y+size/rows);
        ctx.stroke();
    }
    drawTopWall(){
        ctx.beginPath();
        let x=this.colnum*cellSize
        let y=this.rownum*cellSize
        ctx.moveTo(x,y);
        ctx.lineTo(x+size/cols,y);
        ctx.stroke();
    }
    show(){
        ctx.strokeStyle="green";
        ctx.lineWidth=2;
        if(this.walls.left) this.drawLeftWall();
        if(this.walls.right) this.drawRightWall();
        if(this.walls.bottom) this.drawBottomWall();
        if(this.walls.Top) this.drawTopWall();
    }
    bringNeighbour(){
        let topCell=this.rownum==0 ? undefined : grid[this.rownum-1][this.colnum];
        let leftCell=this.colnum==0 ? undefined : grid[this.rownum][this.colnum-1];
        let rightCell=this.colnum==grid.length-1 ? undefined : grid[this.rownum][this.colnum+1];
        let bottomCell=this.rownum==grid.length-1 ? undefined : grid[this.rownum+1][this.colnum];

        let neighbours=[];
        if(topCell && !topCell.visited) neighbours.push(topCell); 
        if(leftCell && !leftCell.visited) neighbours.push(leftCell); 
        if(rightCell && !rightCell.visited) neighbours.push(rightCell); 
        if(bottomCell && !bottomCell.visited) neighbours.push(bottomCell);
        
        if(neighbours.length){
            return neighbours[Math.floor(Math.random()*neighbours.length)];
        }
        return undefined;
    }
    bringNeighbours(){
        let topCell=this.rownum==0 ? undefined : grid[this.rownum-1][this.colnum];
        let leftCell=this.colnum==0 ? undefined : grid[this.rownum][this.colnum-1];
        let rightCell=this.colnum==grid.length-1 ? undefined : grid[this.rownum][this.colnum+1];
        let bottomCell=this.rownum==grid.length-1 ? undefined : grid[this.rownum+1][this.colnum];

        let neighbours=[];
        if(topCell && !topCell.visited && topCell.walls.bottom==false && this.walls.top==false) neighbours.push(topCell); 
        if(leftCell && !leftCell.visited && this.walls.left==false && leftCell.walls.right==false) neighbours.push(leftCell); 
        if(rightCell && !rightCell.visited && this.walls.right==false && rightCell.walls.left==false) neighbours.push(rightCell); 
        if(bottomCell && !bottomCell.visited && this.walls.bottom==false && bottomCell.walls.top==false) neighbours.push(bottomCell);
        if(neighbours.length){
            return neighbours[Math.floor(Math.random()*neighbours.length)];
        }
        return undefined;
    }
    removeWalls(cell){
        // console.log(this.rownum,this.colnum,cell.rownum,cell.colnum)
        let x=this.colnum-cell.colnum;
        let y=this.rownum-cell.rownum;
        if (x === 1) {
            this.walls.left = false;
            cell.walls.right = false;
        } else if (x === -1) {
            this.walls.right = false;
            cell.walls.left = false;
        }
        if (y === 1) {
            this.walls.top = false;
            cell.walls.bottom = false;
        } else if (y === -1) {
            this.walls.bottom = false;
            cell.walls.top = false;
        }
    }
    highlight(columns) {
        let x = (this.colnum * size) / columns + 1;
        let y = (this.rownum * size) / columns + 1;
        ctx.fillStyle = "blue";
        ctx.fillRect(
          x,
          y,
          cellSize - 3,
          cellSize - 3
        );
    }
    nonhighLight(columns){
        let x = (this.colnum * size) / columns + 1;
        let y = (this.rownum * size) / columns + 1;
        ctx.fillStyle = "black";
        ctx.fillRect(
          x,
          y,
          cellSize - 3,
          cellSize - 3
        );
    }
}

for(let i=0;i<rows;i++){
    let rowArr=[];
    for(let j=0;j<cols;j++){
        rowArr.push(new Cell(i,j));
    }
    grid.push(rowArr);
}
currentCell=grid[0][0];

function draw(){
    let obj=document.querySelector('.obj');
    canvas.width = size;
    canvas.height = size;
    canvas.style.background="black"
    
    currentCell.visited=true;
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            grid[i][j].show();
        }
    }
    let nextcell=currentCell.bringNeighbour();
    if(nextcell){
        nextcell.visited=true;
        stack.push(currentCell);
        currentCell.highlight(cols);
        currentCell.removeWalls(nextcell);
        //console.log(nextcell.rownum,nextcell.colnum);
        currentCell=nextcell;
    }
    else if(stack.length>0){
        currentCell=stack.pop();
    }
    else if(stack.length===0){ 
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                grid[i][j].visited=false;
            }
        }
        return;
    }
    requestAnimationFrame(()=>{
        draw();
    });
} 
canvas.width = size;
canvas.height = size;
canvas.style.background="black"

function play(e){
    // let e=document.addEventListener('keypress')
    currentCell.visited=true;
    let key = e.key;
    let row = currentCell.rownum;
    let col = currentCell.colnum;
    
    switch(key){
        case 'ArrowUp' :
            if(!currentCell.walls.top && row!=0){
                let next=grid[row-1][col];
                if(next.visited==true){
                    console.log("Sdf")
                    currentCell.nonhighLight(cols);
                }
                currentCell=next;
            }
            break;
        case 'ArrowDown' :
            if(!currentCell.walls.bottom && row!=grid.length-1){
                let next=grid[row+1][col];
                if(next.visited==true){
                    console.log("Sdf")
                    currentCell.nonhighLight(cols);
                }
                currentCell=next;
            }
            break;
        case 'ArrowLeft' :
            if(!currentCell.walls.left && cols!=0){
                let next=grid[row][col-1];
                if(next.visited==true){
                    console.log("Sdf")
                    currentCell.nonhighLight(cols);
                }
                currentCell=next;
            }
            break;
        case 'ArrowRight' :
            if(!currentCell.walls.right && cols!=grid.length-1){
                let next=grid[row][col+1];
                if(next.visited==true){
                    console.log("Sdf")
                    currentCell.nonhighLight(cols);
                }
                currentCell=next;
            }
            break;
    }
    currentCell.visited=true;
    currentCell.highlight(cols);
}
function dra(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            grid[i][j].show();
            grid[i][j].walls.left=true;
            grid[i][j].walls.right=true;
            grid[i][j].walls.top=true;
            grid[i][j].walls.bottom=true;
            grid[i][j].visited=false;
        }
    }
    currentCell=grid[0][0];
    draw();
}

let stackk=[];
currentCell=grid[0][0];
let endCell=grid[grid.length-1][grid.length-1];
let cCell=grid[0][0];

function find(){
    cCell.visited=true;
    cCell.highlight(cols);
    if(cCell==endCell){
        return;
    }
    let nCell=cCell.bringNeighbours();
    if(nCell){
        nCell.visited=true;
        stackk.push(cCell);
        //console.log(nextcell.rownum,nextcell.colnum);
        cCell=nCell;
    }
    else if(stackk.length>0){
        while(stackk.length>0){
            cCell.nonhighLight(cols);
            cCell=stackk.pop();
            if(cCell.bringNeighbours()){
                break;
            }
        }
    }
    else if(stack.length===0){ 
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                grid[i][j].visited=false;
            }
        }
        console.log("df,mbv\n");
        return;
    }
    requestAnimationFrame(()=>{
        find();
    });
}
function findpath(){
    cCell=grid[0][0];
    find();
}

document.querySelector('.gen').addEventListener("click",dra);
document.addEventListener('keydown',play);
document.querySelector('.FindPath').addEventListener("click",findpath);