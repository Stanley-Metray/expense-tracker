let expenses;
let id;

// handling submission and updation

function handleSubmit(e) {
    e.preventDefault();
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
        id = undefined;
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
        const Expense = new FormData(e.target);
        const selectElement = document.getElementById('category');
        const selectedValue = selectElement.value;
        Expense.append('expense_category', selectedValue);
        Expense.append('id', id);

        const response = await axios.put('/update-expense', Expense, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const status = response.status;
        if (status === 200) {
            setMessage(`<p>Updated &nbsp; &nbsp;<i class="bi bi-check-circle-fill"></i></p>`);
            setDataToUI();
            e.target.reset();
        }
    } catch (error) {
        setMessage(`<p>${'Internal Server Error'} <i class="bi bi-x-circle-fill"></i></p>`);
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

    id = expense.id;
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
    console.log(id)
    try {
        if (id) {
            const response = await axios.delete(`/delete-expense?id=${id}`);
            e.target.classList.replace('d-inline-block', 'd-none');
            const data = await response.data;
            setMessage(`<p>${data} &nbsp; &nbsp;<i class="bi bi-check-circle-fill"></i></p>`);
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

async function setDataToUI() {
    try {
        const response = await axios.get(`http://localhost:3000/get-all-expenses`);
        
        expenses = await response.data;
        if (Array.isArray(expenses)) {
            let html = '';
            let total = 0;
            expenses.forEach((expense, index) => {
                console.log(expense);
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
    } catch (error) {
        document.getElementById('all-expenses').innerHTML = '';
        setMessage(`<p>${await error.response.data} <i class="bi bi-x-circle-fill"></i></p>`);
    }
}


function convertedDate(dateStr) {
    const date = new Date(dateStr);

    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}