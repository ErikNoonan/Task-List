$(function() {
    $('form').on('submit', addTask);
    $('.tasks').on('click', '.delete', deleteTask);
    $('.tasks').on('click', '.complete', completeTask);

    $('.tasks').sortable();
    $('.tasks').disableSelection();

    getTasks();
});

// get request to get task items from the server
function getTasks() {
    $.get('/items')
        .then(function(taskItems) {
            console.log(taskItems);
            appendItems(taskItems);
        });
};

// appends the info from server to DOM
function appendItems(taskItems) {
    $('.tasks').empty();
    $('.completedTasks').empty();
    taskItems.forEach(function(item) {
        var id = item.id;
        var taskItems = item.item;
        var complete = item.complete;

        var $divOfItems = $('<div class="divOfItems"></div>');

        // checks if task is complete or not
        if (complete == true) {
            var $completeButton = $('<button class="complete">Do Again?</button>');
            $completeButton.data({
                id: id,
                complete: complete
            });
            $divOfItems.append($completeButton);
            $divOfItems.append('<p class="completeTask">' + taskItems + '</p>');
        } else {
            var $completeButton = $('<button class="complete">COMPLETE</button>');
            $completeButton.data({
                id: id,
                complete: complete
            });
            $divOfItems.append($completeButton);
            $divOfItems.append('<p>' + taskItems + '</p>');
        }

        var $deleteButton = $('<button class="delete">DELETE</button>');
        $deleteButton.data('id', id);
        $divOfItems.append($deleteButton);

        // checks if task is complete or not
        if (complete == true) {
            $('.completedTasks').append($divOfItems);
        } else {
            $('.tasks').append($divOfItems);
        }
    });
};

// adds task to DOM
function addTask(event) {
    event.preventDefault();
    var itemData = $(this).serialize();

    $.post('/items', itemData)
        .then(function(response) {
            getTasks();
        })
        .catch(function() {
            console.log('no tasks');
        });

    $('input[type=text]').val('');
};

// deletes event from DOM
function deleteTask() {
    var confirmOnDelete = confirm('Do you really want to delete this?');
    if (confirmOnDelete == false) {
        return;
    } else {
        var id = $(this).data('id');

        $.ajax({
            type: 'DELETE',
            url: '/items/' + id,
            success: function() {},

            error: function() {
                console.log('no tasks');
            },
        });

        $(this).closest('div').remove();

    }
}

// updates status of completed item once 'complete' is clicked
function completeTask() {
    var id = $(this).data('id');
    var complete = $(this).data('complete');

    if (complete == true) {
        complete = false;
    } else {
        complete = true;
    }

    completeData = {
        complete: complete
    };

    $.ajax({
        type: 'PUT',
        url: '/items/' + id,
        data: completeData,
        success: getTasks,
        error: function() {
            console.log('no tasks');
        },
    });
}
