// Function to render the task list
function renderTasklist() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    console.log("Rendering tasks:", tasks);

    $('#to-do-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    tasks.forEach(task => {
        const taskCard = `
          <div class="card mb-3 task-card ${task.status === 'done' ? 'bg-done' : task.color}" data-id="${task.id}">
            <div class="card-body">
              <h5 class="card-title">${task.title}</h5>
              ${task.status === 'done' ? `<p class="card-text">${task.description}</p>` : ''}
              <p class="card-text"><small class="text-muted">${task.duedate}</small></p>
              <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
            </div>
          </div>
        `;

        $(`#${task.status}-cards`).append(taskCard);
    });

    // Initialize drag-and-drop
    initDragAndDrop();
}

// Function to initialize drag-and-drop
function initDragAndDrop() {
    $('.task-card').draggable({
        revert: 'invalid',
        start: function (event, ui) {
            $(this).css('z-index', 100);
        },
        stop: function (event, ui) {
            $(this).css('z-index', 1);
        }
    });

    $('.lane .card-body').droppable({
        accept: '.task-card',
        drop: function (event, ui) {
            const taskId = $(ui.draggable).data('id');
            const newStatus = $(this).closest('.lane').attr('id');
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.status = newStatus.replace('-cards', '');
                if (task.status === 'done') {
                    task.color = 'bg-done';
                }
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasklist();
            }
        }
    });

    // Add delete task functionality
    $('.delete-task').click(function() {
        const taskId = $(this).data('id');
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasklist();
    });
}

// Define the handleAddTask function
function handleAddTask(event) {
    event.preventDefault();

    const title = $('#taskTitle').val().trim();
    const description = $('#taskDescription').val().trim();
    const duedate = $('#taskDuedate').val().trim();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const newTask = {
        id: Date.now(),
        title,
        description,
        duedate,
        status: 'to-do',
        color: 'bg-warning'
    };

    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasklist();

    $('#formModal').modal('hide');
}

// Initialize the application
$(document).ready(function () {
    console.log("Document is ready");
    renderTasklist();

    $('#taskForm').on('submit', handleAddTask);
    $('#formModal').on('show.bs.modal', function () {
        $('#taskTitle').val('');
        $('#taskDescription').val('');
        $('#taskDuedate').val('');
    });

    // Initialize date picker for task due date
    $('#taskDuedate').datepicker({
        dateFormat: 'mm/dd/yy'
    });
});
