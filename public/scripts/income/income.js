let incomes;
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
        const Income = new FormData(e.target);
        Income.append('id', id);

        const response = await axios.put('/update-income', Income, {
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

document.getElementById('income-table').addEventListener('click', (e) => {
    const Income = incomes[e.target.closest('tr').id];
    document.getElementById('income_name').value = Income.income_name;
    document.getElementById('income_amount').value = Income.income_amount;
    document.getElementById('income_description').value = Income.income_description;
   

    id = Income.id;
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
    e.stopPropagation();
    try {
        if (id) {
            const response = await axios.delete(`/delete-income?id=${id}`);
            e.target.classList.replace('d-inline-block', 'd-none');
            const data = await response.data;
            if (data)
                setMessage(`<p>Income Deleted &nbsp; &nbsp;<i class="bi bi-check-circle-fill"></i></p>`);
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


async function setDataToUI() {
    try {
        const response = await axios.get(`/get-all-incomes`);
        incomes = await response.data;
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
                <td>${income.income_amount}</td>
            </tr>`;
            });
            html += `<tr>
        <td></td>
        <td></td>
        <td></td>
        <td class='text-end text-success fw-bolder'>Total:</td>
        <td class='text-success fw-bolder'>${total}</td>
    </tr>`;

            document.getElementById('all-incomes').innerHTML = html;
        }
    } catch (error) {
        console.log(error);
        document.getElementById('all-incomes').innerHTML = '';
        setMessage(`<p>${await error.response.data} <i class="bi bi-x-circle-fill"></i></p>`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setDataToUI();
});

function convertedDate(dateStr) {
    const date = new Date(dateStr);

    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}