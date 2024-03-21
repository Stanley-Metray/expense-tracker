let expenses;
let temp_expense;

// handling submission and updation

function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    const button = document.getElementById('submit');
    const btnDelete = document.getElementById('btn-delete');

    if (button.getAttribute('data-bs-update') === 'false') {
        submit(e);
    }
    else {
        update(e);
        button.innerText = 'Add';
        button.setAttribute('data-bs-update', 'false');
        btnDelete.classList.replace('d-inline-block', 'd-none');
        temp_expense = undefined;
    }
}

async function submit(e) {
    try {
        const Expense = new FormData(e.target);
        const selectElement = document.getElementById('category');
        const selectedValue = selectElement.value;
        Expense.append('expense_category', selectedValue);
        const response = await axios.post('/add-expense', Expense, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const status = response.status;
        if (status === 200) {
            setMessage(`<p>Done &nbsp; &nbsp;<i class="bi bi-check-circle-fill"></i></p>`);
            setDataToUI();
            e.target.reset();
        }
    } catch (error) {
        setMessage(`<p>${'Internal Server Error'} <i class="bi bi-x-circle-fill"></i></p>`);
    }
}

async function update(e) {
    try {
        e.preventDefault();
        const formData = new FormData(e.target);
        const selectedValue = document.getElementById('category').value;
        formData.append('expense_category', selectedValue);
        formData.append('id', temp_expense.id);

        const dif = Math.abs(e.target.expense_amount.value - temp_expense.expense_amount);
        formData.append('increase', e.target.expense_amount.value > temp_expense.expense_amount);
        formData.append('dif', dif);

        const response = await axios.put('/update-expense', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        const data = await response.data;

        if (data.success) {
            setDataToUI();
            setMessage(`<p>Updated <i class="bi bi-check-circle-fill"></i></p>`);
        } else {
            setMessage(`<p>${data} <i class="bi bi-x-circle-fill"></i></p>`);
        }
    } catch (error) {
        console.log(error);
        setMessage(`<p>Something went wrong <i class="bi bi-x-circle-fill"></i></p>`);
    }
}


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// handling which item to delete or update 

document.getElementById('expense-table').addEventListener('click', (e) => {
    const expense = expenses[e.target.closest('tr').id];
    document.getElementById('expense_name').value = expense.expense_name;
    document.getElementById('expense_amount').value = expense.expense_amount;
    document.getElementById('expense_description').value = expense.expense_description;
    const selectElement = document.getElementById('category');
    Array.from(selectElement.options).forEach((option) => {
        if (option.value === expense.expense_category) {
            option.selected = true;
        } else {
            option.selected = false;
        }
    });

    temp_expense = expense;
    const button = document.getElementById('submit');
    const btnDelete = document.getElementById('btn-delete');
    button.innerText = 'Update';
    btnDelete.classList.replace('d-none', 'd-inline-block');
    button.setAttribute('data-bs-update', 'true');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// function to delete selected expense 

document.getElementById('btn-delete').addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
        if (id) {
            const response = await axios.delete(`/delete-expense?id=${id}`);
            e.target.classList.replace('d-inline-block', 'd-none');
            const data = await response.data;
            if (data)
                setMessage(`<p>Expense Deleted &nbsp; &nbsp;<i class="bi bi-check-circle-fill"></i></p>`);
        }

        setDataToUI();
    } catch (error) {
        setMessage(`<p>${'Internal Server Error'} <i class="bi bi-x-circle-fill"></i></p>`);
    }
});

function setMessage(HTML) {
    const messageElement = document.getElementById('message');
    messageElement.innerHTML = `${HTML}`;
    messageElement.style.visibility = 'visible';

    setTimeout(() => {
        messageElement.style.visibility = 'hidden';
    }, 3000);
}


document.addEventListener('DOMContentLoaded', () => {
    setDataToUI();
});

const setPagination = async (pagination) => {

    if (pagination.isPagination) {
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.classList.replace('d-none', 'd-flex');

        paginationContainer.innerHTML = `<ul class="pagination">
        <li class="page-item"><button class="page-link" onclick='getPaginationData(event)' value=${pagination.prev}><i class="bi bi-caret-left-fill"></i></button></li>
        <li class="page-item"><button class="page-link" onclick='getPaginationData(event)' value=${pagination.currentPage}>1</button></li>
        <li class="page-item"><button class="page-link" onclick='getPaginationData(event)' value=${pagination.next}><i class="bi bi-caret-right-fill"></i></button></li>
</div>`;

        return true;
    }
    else return false;

}

const setExpenseTableData = (expenses) => {
    if (Array.isArray(expenses)) {
        let html = '';
        let total = 0;
        expenses.forEach((expense, index) => {
            let date = convertedDate(expense.updatedAt);
            total = total + expense.expense_amount;
            html += `<tr id='${index}'>
        <td>${date}</td>
        <td>${expense.expense_name}</td>
        <td>${expense.expense_category}</td>
        <td>${expense.expense_description}</td>
        <td>${expense.expense_amount}</td>
    </tr>`;
        });
        html += `<tr>
<td></td>
<td></td>
<td></td>
<td class='text-end text-success fw-bolder'>Total:</td>
<td class='text-success fw-bolder'>${total}</td>
</tr>`;

        document.getElementById('all-expenses').innerHTML = html;
    }
}

const getPaginationData = async (event) => {
    event.stopPropagation();
    try {
        const URL = `http://localhost:3000/get-expenses-pagination?page=${event.target.closest('button').value}`;
        const response = await axios.get(URL);
        const data = await response.data;
        expenses = data.expenses;
        const pagination = data.pagination;
        let paginationContainer = document.getElementById('pagination-container');
        if (pagination.isPagination) {

            paginationContainer.classList.replace('d-none', 'd-flex');
            paginationContainer.innerHTML = `<ul class="pagination">
            <li class="page-item"><button class="page-link" onclick='getPaginationData(event)' value=${pagination.prev}><i class="bi bi-caret-left-fill"></i></button></li>
            <li class="page-item"><button class="page-link" onclick='getPaginationData(event)' value=${pagination.currentPage}>${pagination.currentPage}</button></li>
            <li class="page-item"><button id='next-page' class="page-link" onclick='getPaginationData(event)' value=${pagination.next}><i class="bi bi-caret-right-fill"></i></button></li>
    </div>`;

            setExpenseTableData(expenses);
        }
        else {
            document.getElementById('next-page').disabled = true;
        }

    } catch (error) {
        console.log(error);
    }
}

async function setDataToUI() {
    try {
        const response = await axios.get(`http://localhost:3000/get-expenses-pagination?page=1`);
        const data = await response.data;
        expenses = data.expenses;
        const pagination = data.pagination;
        if (setPagination(pagination))
            setExpenseTableData(expenses);

    } catch (error) {
        document.getElementById('all-expenses').innerHTML = '';
        setMessage(`<p>${await error.response.data} <i class="bi bi-x-circle-fill"></i></p>`);
    }
}


function convertedDate(dateStr) {
    const date = new Date(dateStr);

    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}

