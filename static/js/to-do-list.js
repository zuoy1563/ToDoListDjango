var selectedShowingOption = 1;
var testdata;

function fillTable() {
    let filtered = filterData();

    table = $('#items').DataTable({
        "data": filtered,
        select: "single",
        "columns": [
            // a plus or a minus label for the first column, click to see / hide details
            {
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": '',
                "render": function () {
                    return '<i class="fa fa-plus-square" aria-hidden="true"></i>';
                },
                width: "15px"
            },
            {"data": "title"},
            {"data": "start_date"},
            // the estimated completion date of an item. If the estimated completion date is earlier than current
            // date, the date will be highlighted and "(Over Due)" will be appended
            {
                "data": "comp_date",
                "render": function (a, b, data, d) {
                    let default_content = data.comp_date;
                    if (!compareDates(formatCurrentDate(), data.comp_date) && data.status === "NC") {
                        return '<p class="text-danger">' + default_content + " (Over Due)" + '</p>';
                    }
                    return default_content;
                }
            },
            {
                "data": "status",
                // render N and C to make it more readable
                "render": function (a, b, data, d) {
                    if (data.status === "C") {
                        return "Completed";
                    }
                    return "Not Completed";
                }
            },
            {
                "orderable": false,
                "data": null,
                "className": "center",
                // if the item is completed, it cannot be marked as completed again
                "render": function (a, b, data, d) {
                    let default_content = '<a class="edit" href="javascript:void(0)" onclick="showEditModal(table.row( $(this).parents(\'tr\') ))">Edit</a> / <a class="del" href="javascript:void(0)" onclick="deleteItem(table.row( $(this).parents(\'tr\') ));">Delete</a>';
                    if (data.status === "C") {
                        return default_content;
                    }
                    return default_content + '/ <a class="comp" href="javascript:void(0)" onclick="completeItem(table.row( $(this).parents(\'tr\') ));">Complete</a>'
                }
            },

        ],
        "order": [[1, 'asc']],
        "rowCallback": function (row, data, index) {
            if (data.status === "C") { // background color for completed items
                $("td:eq(4)", row).css('background-color', '#cfffb8');
            }
            else {
                $("td:eq(4)", row).css('background-color', '#ffa3a0');
            }
        }
    });

    // Add event listener for opening and closing details
    $('#items tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var tdi = tr.find("i.fa");
        var row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
            tdi.first().removeClass('fa-minus-square');
            tdi.first().addClass('fa-plus-square');
        }
        else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
            tdi.first().removeClass('fa-plus-square');
            tdi.first().addClass('fa-minus-square');
        }
    });

    table.on("user-select", function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).hasClass("details-control")) {
            e.preventDefault();
        }
    });


}

function format(d) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '<tr>' +
        '<td>Description:</td>' +
        '<td>' + d.description + '</td>' +
        '</tr>' +
        '</table>';
}

function filterData() {
    var filtered;
    // if only show items which are not completed yet
    if (selectedShowingOption == 1) {  // note: cannot use === here since selected value is String but not Number
        filtered = testdata.data.filter(data => data.status === "NC");
    }
    // if only show items which are completed
    else if (selectedShowingOption == 2) {
        filtered = testdata.data.filter(data => data.status === "C");
    }
    // show all items
    else {
        filtered = testdata.data;
    }
    return filtered;
}

window.onload = function () {
    // get all data from database
    $.ajax("/api/v1/items/").done(function (json) {
        console.log(json);
        testdata = {"data": json};
        fillTable();
    })
};


$('#createBtn').click(function () {
    // get user input
    let title = $('#title').val();
    let desc = $('#desc').val();
    let s_date = $('#s_date').val();
    let e_date = $('#e_date').val();

    // validate input
    let errors = validateFields(title, desc, s_date, e_date);
    if (errors.length !== 0) {
        let strings;
        errors.forEach(function (ele) {
            strings += ele + "\n";
        });
        alert(strings);
    }
    else {
        $.ajax({
            method: "POST",
            url: "/api/v1/items/",
            data: {
                title: title,
                description: desc,
                start_date: s_date,
                comp_date: e_date,
            }
        })
            .done(function (json) {
                console.log(json);
                $('#createModal').modal('hide');
                reloadTable();
            })
    }
});

function showEditModal(row) {
    // initialise fields, show current value by default
    let id = row.data()['item_id'];
    let title = row.data()['title'];
    let desc = row.data()['description'];
    let s_date = row.data()['start_date'];
    let e_date = row.data()['comp_date'];
    $('input[id=editTitle]').val(title);
    $('textarea[id=editDesc]').val(desc);
    $('input[id=edits_date]').val(s_date);
    $('input[id=edite_date]').val(e_date);
    $('#editId').val(id);
    $('#editModalBtn').click();
}

$('#editBtn').click(function () {
    // get user input
    let id = $('#editId').val();
    let title = $('#editTitle').val();
    let desc = $('#editDesc').val();
    let s_date = $('#edits_date').val();
    let e_date = $('#edite_date').val();

    // validate input
    let errors = validateFields(title, desc, s_date, e_date);
    if (errors.length !== 0) {
        let strings = "";
        errors.forEach(function (ele) {
            strings += ele + "\n";
        });
        alert(strings);
    }
    else {
        $.ajax({
            method: "PUT",
            url: "/api/v1/items/" + id,
            data: {
                title: title,
                description: desc,
                start_date: s_date,
                comp_date: e_date,
            }
        })
            .done(function (json) {
                console.log(json);
                $('#editModal').modal('hide');
                reloadTable();
            })
    }
});

function reloadTable() {
    table.clear();
    $.ajax("/api/v1/items/").done(function (json) {
        testdata = {"data": json};
        let filtered = filterData();
        console.log(filtered);
        table.rows.add(filtered).draw();
    });

}

function completeItem(row) {
    let data = row.data(); // get data in current row
    let id = data['item_id'];
    $.ajax({
        method: "PUT",
        url: "/api/v1/items/" + id,
        data: {
            title: data.title,
            description: data.description,
            start_date: data.start_date,
            comp_date: data.comp_date,
            status: "C",
        }
    })
        .done(function (json) {
            reloadTable();
        });
}

function deleteItem(row) {
    let data = row.data(); // get data in current row
    let id = data['item_id'];
    $.ajax({
        method: "DELETE",
        url: "/api/v1/items/" + id,
    })
        .done(function (json) {
            console.log(json);
            reloadTable();
        })
}

function validateFields(title, desc, s_date, e_date) {
    // date pattern: yyyy-MM-dd
    const DATE_REGEX = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
    var errors = [];
    if (title.length === 0 || title.length > 50) {
        errors.push("Please enter 1 - 50 characters as title");
    }
    if (desc.length === 0 || desc.length > 500) {
        errors.push("Please enter 1 - 50 characters as description");
    }
    if (!DATE_REGEX.test(s_date) || !DATE_REGEX.test(e_date)) {
        errors.push("Please follow yyyy-MM-dd pattern for dates");
    }
    if (!compareDates(formatCurrentDate(), s_date)) {
        errors.push("Please enter a start date which is or later than today");
    }
    if (!compareDates(s_date, e_date)) {
        errors.push("Please enter an end date which is later than the start date");
    }
    return errors;
}

function compareDates(s_date, e_date) {
    let arr_s = s_date.split("-");
    let start_date = new Date(arr_s[0], arr_s[1], arr_s[2]).getTime();

    let arr_e = e_date.split("-");
    let end_date = new Date(arr_e[0], arr_e[1], arr_e[2]).getTime();

    if (start_date >= end_date) {  // if start date is later than end date, there must be some problems
        return false;
    }
    else
        return true;
}

function formatCurrentDate() {
    let date = new Date();
    let s = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return s;
}

$('#show').change(function () {
    selectedShowingOption = $('#show').val();
    reloadTable();
});

