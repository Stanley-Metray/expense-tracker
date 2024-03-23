let incomes;
let temp_income;

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
        temp_income = undefined;
    }
}

async function submit(e) {
    try {
        const Income = new FormData(e.target);
        const selectElement = document.getElementById('category');
        const selectedValue = selectElement.value;
        Income.append('income_category', selectedValue);
        const response = await axios.post('/add-income', Income, {
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
        console.log(error);
        setMessage(`<p>${'Internal Server Error'} <i class="bi bi-x-circle-fill"></i></p>`);
    }
}

async function update(e) {
    try {
        const formData = new FormData(e.target);
        const selectedValue = document.getElementById('category').value;
        formData.append('income_category', selectedValue);
        formData.append('id', temp_income.id);

        const dif = Math.abs(e.target.income_amount.value - temp_income.income_amount);
        formData.append('increase', e.target.income_amount.value > temp_income.income_amount);
        formData.append('dif', dif);

        const response = await axios.put('/update-income', formData, {
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

document.getElementById('income-table').addEventListener('click', (e) => {
    const Income = incomes[e.target.closest('tr').id];
    document.getElementById('income_name').value = Income.income_name;
    document.getElementById('income_amount').value = Income.income_amount;
    document.getElementById('income_description').value = Income.income_description;


    temp_income = Income;
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

// function to delete selected income 

document.getElementById('btn-delete').addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
        if (temp_income) {
            const response = await axios.delete(`/delete-income?id=${temp_income.id}`);
            e.target.classList.replace('d-inline-block', 'd-none');
            const data = await response.data;
            if (data)
                setMessage(`<p>Income Deleted &nbsp; &nbsp;<i class="bi bi-check-circle-fill"></i></p>`);
        }

        setDataToUI();
    } catch (error) {
        console.log(error);
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

const setIncomeTableData = (incomes) => {
    if (Array.isArray(incomes)) {
        let html = '';
        let total = 0;
        incomes.forEach((income, index) => {
            let date = convertedDate(income.updatedAt);
            total = total + income.income_amount;
            html += `<tr id='${index}'>
        <td>${date}</td>
        <td>${income.income_name}</td>
        <td>${income.income_category}</td>
        <td>${income.income_description}</td>
        <td>${income.income_amount.toLocaleString()}</td>
    </tr>`;
        });
        html += `<tr>
<td></td>
<td></td>
<td></td>
<td class='text-end text-success fw-bolder'>Total:</td>
<td class='text-success fw-bolder'>${total.toLocaleString()}</td>
</tr>`;

        document.getElementById('all-incomes').innerHTML = html;
    }
}

const getPaginationData = async (event) => {
    event.stopPropagation();
    try {
        let limit = localStorage.getItem('rows_per_page');
        const URL = `/get-incomes-pagination?page=${event.target.closest('button').value}&limit=${limit}`

        const response = await axios.get(URL);
        const data = await response.data;
        incomes = data.incomes;
        const pagination = data.pagination;
        let paginationContainer = document.getElementById('pagination-container');
        if (pagination.isPagination) {

            paginationContainer.classList.replace('d-none', 'd-flex');
            paginationContainer.innerHTML = `<ul class="pagination">
            <li class="page-item"><button class="page-link" onclick='getPaginationData(event)' value=${pagination.prev}><i class="bi bi-caret-left-fill"></i></button></li>
            <li class="page-item"><button class="page-link" onclick='getPaginationData(event)' value=${pagination.currentPage}>${pagination.currentPage}</button></li>
            <li class="page-item"><button id='next-page' class="page-link" onclick='getPaginationData(event)' value=${pagination.next}><i class="bi bi-caret-right-fill"></i></button></li>
    </div>`;

            setIncomeTableData(incomes);
        }

    } catch (error) {
        console.log(error);
    }
}

async function setDataToUI() {
    try {
        const limit = localStorage.getItem('rows_per_page') || 10;
        const response = await axios.get(`/get-incomes-pagination?page=1&limit=${limit}`);
        const data = await response.data;
        incomes = data.incomes;
        const pagination = data.pagination;
        setPagination(pagination);
        setIncomeTableData(incomes);
        const res = await axios.get('/get-balance-sheet');
        const dat = await res.data;
        let icon;
        if(dat.balance<0)
            icon = `<i class="bi bi-graph-down-arrow text-danger"></i>`;
        else
            icon = `<i class="bi bi-graph-up-arrow text-success"></i>`;

        document.getElementById('net-income').innerHTML = `<span class='text-success'>Net Income: ${dat.total_income.toLocaleString()}</span> | <span class='text-danger'>Net Expense: ${dat.total_expense.toLocaleString()}</span> | <span class='text-warning'>Balance: ${dat.balance}</span> &nbsp; &nbsp;${icon}`;

    } catch (error) {
        document.getElementById('all-incomes').innerHTML = '';
        setMessage(`<p>${await error.response.data} <i class="bi bi-x-circle-fill"></i></p>`);
    }
}


document.getElementById('rows-per-page').addEventListener('change', (e) => {
    localStorage.setItem("rows_per_page", e.target.value);
    window.location.reload();
});

document.addEventListener('DOMContentLoaded', () => {
    setDataToUI();
});


function convertedDate(dateStr) {
    const date = new Date(dateStr);

    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}

// **************************************************************
// async function setDataToUI() {
//     try {
//         const response = await axios.get(`/get-all-incomes`);
//         incomes = await response.data;
//         if (Array.isArray(incomes)) {
//             let html = '';
//             let total = 0;
//             incomes.forEach((income, index) => {
//                 let date = convertedDate(income.updatedAt);
//                 total = total + income.income_amount;
//                 html += `<tr id='${index}'>
//                 <td>${date}</td>
//                 <td>${income.income_name}</td>
//                 <td>${income.income_category}</td>
//                 <td>${income.income_description}</td>
//                 <td>${income.income_amount}</td>
//             </tr>`;
//             });
//             html += `<tr>
//         <td></td>
//         <td></td>
//         <td></td>
//         <td class='text-end text-success fw-bolder'>Total:</td>
//         <td class='text-success fw-bolder'>${total}</td>
//     </tr>`;

//             document.getElementById('all-incomes').innerHTML = html;
//         }
//     } catch (error) {
//         console.log(error);
//         document.getElementById('all-incomes').innerHTML = '';
//         setMessage(`<p>${await error.response.data} <i class="bi bi-x-circle-fill"></i></p>`);
//     }
// }

// document.addEventListener('DOMContentLoaded', () => {
//     setDataToUI();
// });

// function convertedDate(dateStr) {
//     const date = new Date(dateStr);

//     const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
//     const formattedDate = date.toLocaleDateString('en-US', options);
//     return formattedDate;
// }