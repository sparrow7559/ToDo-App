let tasks=[];
let currentFilter='all';
let editingTaskId=null;
let taskIdCounter=1;

let taskInput,addBtn,taskList,emptyState,totalTasks,completedTasks,filterBtns;

function init(){
    taskInput=document.getElementById('taskInput');
    addBtn=document.getElementById('addBtn');
    taskList=document.getElementById('tasklist');
    emptyState=document.getElementById("emptystate");
    totalTasks=document.getElementById('totalTasks');
    completedTasks=document.getElementById('completedTasks');
    filterBtns=document.querySelectorAll('.filter-Btn');

    addBtn.addEventListener('click',addTask);
    taskInput.addEventListener('keypress',function(e){
        if(e.key==='Enter'){
            addTask();
        }
    });
    filterBtns.forEach(function(btn){
        btn.addEventListener('click',function(e){
            setFilter(e.target.dataset.filter);
        })
    });
    loadTasks();
    render();
}
function loadTasks(){
    const saved = localStorage.getItem('todoTasks');
    if(saved){
        tasks=JSON.parse(saved);
        taskIdCounter=Math.max(...tasks.map(t=>t.id),0)+1;
    }

}
function saveTasks(){
    localStorage.setItem('todoTasks',JSON.stringify(tasks));
    console.log(tasks);
    
}
function addTask(){
    const text = taskInput.value.trim();
    if(!text) return;
    const newTask={
        id:taskIdCounter++,
        text:text,
        completed:false,
        createdAt:new Date().toISOString()
    };
    tasks.unshift(newTask);
    taskInput.value='';
    saveTasks();
    render();
}

function toggleTask(id){
    const task = tasks.find((t)=>{
        return t.id===id;
    });
    if(task){
        task.completed=!task.completed;
        saveTasks();
        render();
    }
}

function deleteTask(id){
    tasks=tasks.filter((t)=>{
        return t.id !==id;
    });
    saveTasks();
    render();
}

function editTask(id){
    editingTaskId=id;
    render();
}

function saveEdit(id,newText){
    const text = newText.trim();
    if(!text) return;
    const task = tasks.find((t)=>{
        return t.id===id;
    });
    if(task){
        task.text=text;
        editingTaskId=null;
        saveTasks();
        render();
    }
}

function cancelEdit(){
    editingTaskId=null;
    render();
}

function setFilter(filter){
    currentFilter=filter;
    filterBtns.forEach(function(btn){
        if(btn.dataset.filter===filter){
            btn.classList.add('active');
        }else{
            btn.classList.remove('active');
        }
    });
    render();
}

function getFilteredTasks(){
    if(currentFilter==="completed"){
        return tasks.filter(function(task){
            return task.completed;
        });
    }else if(currentFilter==='pending'){
        return tasks.filter(function(task){
            return !task.completed;
        });
    }else{
        return tasks;
    }
}

function updateStats(){
    const total = tasks.length;
    const completed=tasks.filter(function(t){
        return t.completed;
    }).length;
    totalTasks.textContent=`${total} task ${(total !== 1 ? 's' : '')}`;
    completedTasks.textContent=completed+' completed';
}

function renderTask(task){
    const isEditing = editingTaskId===task.id;

    if(isEditing){
        return '<li class="task-item ' + (task.completed ? 'completed' : '') + '">' + '<input type="text" class="edit-input" value="' + task.text + '" '+ 'id="editInput-' + task.id +'">'+
        '<div class="task-actions">' +
            '<button class="task-btn save-btn" onclick="saveEdit(' + task.id+', document.getElementById(\'editInput-' + task.id +'\').value)">'+
                'Save'+
            '</button>'+
            '<button class="task-btn cancel-btn" onclick="cancelEdit()">'+
                'Cancel'+
            '</button>'+
        '</div>'+
    '</li>';
    }
    return '<li class="task-item ' + (task.completed ? 'completed' : '') + '">' +
                '<div class="task-checkbox ' + (task.completed ? 'checked' : '') + '" ' +
                'onclick="toggleTask(' + task.id + ')"></div>' +
                '<span class="task-text">' + task.text + '</span>' +
                '<div class="task-actions">' +
                    '<button class="task-btn edit-btn" onclick="editTask(' + task.id + ')">' +
                        'Edit' +
                    '</button>' +
                    '<button class="task-btn delete-btn" onclick="deleteTask(' + task.id + ')">' +
                        'Delete' +
                    '</button>' +
                '</div>' +
            '</li>';
}

function render(){
    const filteredTasks=getFilteredTasks();

    updateStats();

    if(filteredTasks.length===0){
        taskList.style.display='none';
        emptyState.style.display='block';

        if(currentFilter==='completed'){
            emptyState.innerHTML='<div class="icon">✅</div>'+
            '<h3>All caught up!</h3>' +
            '<p>No pending tasks. Great job!</p>';
        }else{
            emptyState.innerHTML='<div class="icon">📝</div>'+
            '<h3>No tasks yet</h3>'+
            '<p>Add a task above to get started!</p>';
        }
    }else{
        taskList.style.display='block';
        emptyState.style.display='none';
        let html='';
        for(let i =0;i<filteredTasks.length;i++){
            html+=renderTask(filteredTasks[i]);
        }
        taskList.innerHTML=html;
    }
    if(editingTaskId){
        setTimeout(function(){
            const editInput=document.getElementById('editInput-'+editingTaskId);
            if(editInput){
                editInput.focus();
                editInput.select();
        }
        },0);
    }
}

// init();
window.addEventListener('DOMContentLoaded', init);

