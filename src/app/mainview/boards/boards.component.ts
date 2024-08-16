import { Component,Input, OnInit } from '@angular/core';
import { board } from 'src/app/models/board.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BoardService } from '../board.service';
import { faCoffee,faTrash,faPenToSquare,faPlus } from '@fortawesome/free-solid-svg-icons'
declare var $: any;


@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit  {
  faTrash = faTrash;
  faPlus=faPlus
  faPenToSquare = faPenToSquare
  @Input() board!:board 
  @Input() selectedBoardIndex!:number 
  editBoard:any
  colIndex:any

  

    constructor(private boardService:BoardService){}
  ngOnInit() {
     this.boardService.selectedBoardIndex.subscribe(data=>{this.selectedBoardIndex=data})

    
  }
  ngAfterViewInit(){


  }
  addCategory:FormGroup = new FormGroup(
    { 
     'categoryName': new FormControl(),
     'tasks': new FormArray([])
     
   })
   get tasks(): FormArray {


    return this.addCategory.get('tasks') as FormArray;
  } 

  addTask()
  {
    (<FormArray>this.addCategory.get('tasks')).push(
      new FormGroup({
        'task':new FormControl()
        
      })
    )
  }
 
  edit(colIndex:number){
   console.log(this.selectedBoardIndex)
    if(this.selectedBoardIndex==undefined)
  {
    this.selectedBoardIndex = 0
  }
  let editBoard = this.boardService.getBoardByIndex(this.selectedBoardIndex).columns[colIndex];
  this.editBoard=editBoard
  this.colIndex =colIndex

  let catName = editBoard.name
 
  for(let task of editBoard.tasks)
  {
  
    (<FormArray>this.addCategory.get('tasks')).push(
      new FormGroup({
        'task':new FormControl(task)
        
      })
    )
    
  }

    this.addCategory.patchValue({
      categoryName: catName
   });

    }
    onSubmitEdit()
   { 

   
      this.boardService.editOnBoard(this.selectedBoardIndex,this.colIndex,this.addCategory.value);
      (this.addCategory.get('tasks') as FormArray).clear()
      $('#exampleModal2').modal('hide')
     
    
      $('.modal-backdrop').remove()
      this.addCategory.reset();
    (this.addCategory.get('tasks') as FormArray).clear()

   }
  
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  onSubmit()
  {
    if(this.selectedBoardIndex==undefined)
    {
      this.selectedBoardIndex = 0
    }
    this.boardService.addCat(this.addCategory.value,this.selectedBoardIndex)
    
    this.addCategory.reset();
    (this.addCategory.get('tasks') as FormArray).clear()
    $('#exampleModal1').modal('hide')
     
    
    $('.modal-backdrop').remove()
    this.addCategory.reset();
  (this.addCategory.get('tasks') as FormArray).clear()
   

  }
  close()
  {
    this.addCategory.reset();
    (this.addCategory.get('tasks') as FormArray).clear()
  }

  deleteCat(colIndex:number)
  {
    if(this.selectedBoardIndex==undefined)
    {
      this.selectedBoardIndex = 0
    }
    console.log(this.selectedBoardIndex,this.colIndex)
      this.boardService.deleteCat(this.selectedBoardIndex,colIndex)

  }

  deleteTask(id:number)
  {
    (<FormArray>this.addCategory.get('tasks')).removeAt(id)
  }

}
