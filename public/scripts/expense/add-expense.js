let expenses;
let id;
document.getElementById('expense-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const button = document.getElementById('submit');

    if (button.getAttribute('data-bs-update') === 'false') {
        submit(e);
    }
    else {
        update(e);
        button.innerText = 'Add';
        button.setAttribute('data-bs-update', 'false');
        id = undefined;
    }
});

async function submit(e) {
    try {
        const Expense = new FormData(e.target);
        Expense.append('UserId', localStorage.getItem('id'));
        const response = await axios.post('/add-expense', Expense, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const status = response.status;
        if (status === 200) {
            setMessage(`<p>Done &nbsp; &nbsp;<i class="bi bi-check-circle-fill"></i></p>`, "alert-success");
            setDataToUI();
            e.target.reset();
        }
    } catch (error) {
        setMessage(`<p>${'Internal Server Error'} <i class="bi bi-x-circle-fill"></i></p>`, "alert-danger");
    }
}

async function update(e) {
    try {
        const Expense = new FormData(e.target);
        Expense.append('UserId', localStorage.getItem('id'));
        Expense.append('id', id);

        const response = await axios.put('/update-expense', Expense, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const status = response.status;
        if (status === 200) {
            setMessage(`<p>Updated &nbsp; &nbsp;<i class="bi bi-check-circle-fill"></i></p>`, "alert-success");
            setDataToUI();
            e.target.reset();
        }
    } catch (error) {
        setMessage(`<p>${'Internal Server Error'} <i class="bi bi-x-circle-fill"></i></p>`, "alert-danger");
    }
}

function setMessage(HTML, type) {
    const messageElement = document.getElementById('message');
    messageElement.classList.toggle(type);
    messageElement.innerHTML = `${HTML}`;
    messageElement.style.display = 'block';

    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}


document.addEventListener('DOMContentLoaded', () => {
    setDataToUI();
});

async function setDataToUI() {
    try {
        const id = localStorage.getItem('id');
        const response = await axios.get(`http://localhost:3000/get-all-expenses?UserId=${id}`);
        expenses = await response.data;
        document.getElementById('all-expenses').innerHTML = '';
        let html = '';
        let total = 0;
        expenses.forEach((expense, index) => {

            let date = convertedDate(expense.updatedAt);
            total = total + expense.expense_amount;
            html += `<tr id='${index}'>
                <td>${date}</td>
                <td>${expense.expense_name}</td>
                <td>${expense.expense_description}</td>
                <td>${expense.expense_amount}</td>
            </tr>`;
        });
        html += `<tr>
        <td></td>
        <td></td>
        <td class='text-end text-success fw-bolder'>Total:</td>
        <td class='text-success fw-bolder'>${total}</td>
    </tr>`;

        document.getElementById('all-expenses').innerHTML = html;
    } catch (error) {
        console.log(error);
    }
}


function convertedDate(dateStr) {
    const date = new Date(dateStr);

    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}

document.getElementById('expense-table').addEventListener('click', (e) => {
    const expense = expenses[e.target.closest('tr').id];
    document.getElementById('expense_name').value = expense.expense_name;
    document.getElementById('expense_amount').value = expense.expense_amount;
    document.getElementById('expense_description').value = expense.expense_description;
    id = expense.id;
    const button = document.getElementById('submit');
    button.innerText = 'Update';
    button.setAttribute('data-bs-update', 'true');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});