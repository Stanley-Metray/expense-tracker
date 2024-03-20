document.getElementById('daily-report').addEventListener('click', async (e) => {
    try {
        console.clear();
        const response = await axios.get('/get-daliy-report');
        const data = await response.data;

        const total_expenses = data.total_expenses;
        const total_income = data.total_income;

        const expenses = data.expenses;
        const incomes = data.incomes;

        const report = getCombinedArray(incomes, expenses);
        setDataToUI(total_expenses, total_income, report);

    } catch (error) {
        console.log(error);
    }
});


function getCombinedArray(incomes, expenses) {
    const combinedArray = [...incomes, ...expenses];

    const combinedArrayWithType = combinedArray.map(item => {
        if (item.hasOwnProperty('income_amount')) {
            return { ...item, type: 'income' };
        } else if (item.hasOwnProperty('expense_amount')) {
            return { ...item, type: 'expense' };
        }
    });

    combinedArrayWithType.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return combinedArrayWithType;
}

function convertedDate(dateStr) {
    const date = new Date(dateStr);

    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}

async function setDataToUI(total_expenses, total_income, report) {
    try {
        let html = "";
        report.forEach((element) => {
            if (element.type === 'income') {
                let date = convertedDate(element.createdAt);
                html += `<tr>
                <td>${date}</td>
                <td></td>
                <td>${element.income_description}</td>
                <td class='text-end'>${element.income_amount.toLocaleString()}</td>
                <td></td>
            </tr>`
            }
            else {
                let date = convertedDate(element.createdAt);
                html += `<tr>
                <td>${date}</td>
                <td>${element.expense_category}</td>
                <td>${element.expense_description}</td>
                <td></td>
                <td class='text-end'>${element.expense_amount.toLocaleString()}</td>
            </tr>`
            }

        });

        html += `<tr>
                <td></td>
                <td></td>
                <td></td>
                <td class='text-success fw-bold text-end'>${total_income.toLocaleString()}</td>
                <td class='text-danger fw-bold text-end'>${total_expenses.toLocaleString()}</td>
            </tr>`

        document.getElementById('report').innerHTML = html;
    } catch (error) {
        document.getElementById('all-expenses').innerHTML = '';
        setMessage(`<p>${await error.response.data} <i class="bi bi-x-circle-fill"></i></p>`);
    }
}


document.getElementById('download-report').addEventListener('click', async () => {
    try {
        const response = await axios.get('/download-report');
        const report = await response.data;
        let download = document.createElement('a');
        download.download = true;
        download.href = report.fileURL;
        download.click();
    } catch (error) {
        console.log(error);
        const message = await error.response.data;
        alert(message);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('daily-report').click();
    const response = await axios.get('/premium-status');
    const data = await response.data;
    if(data.premium){
    try {
        const response = await axios.get('/get-download-links');
        const links = await response.data;
        let html = "";
        if (links.length > 0) {
            links.reverse();
            links.forEach((link) => {
                let date = convertedDate(link.createdAt);
                html += `<li><li><a class="dropdown-item link-underline-opacity-100-hover" href=${link.link}>${date}</a></li></li>`;
            });

            document.getElementById('download-links').innerHTML = html;
        }
    } catch (error) {
        console.log(error);
        const message = await error.response.data;
        alert(message);
    }}
    else
    {
        document.getElementById('download-report').classList.add('disabled');
        document.getElementById('btn-recent-download').classList.add('disabled');
        document.getElementById('download-report').innerText = "Buy Premium To Download";
    }
});


function convertedDate(dateStr) {
    const date = new Date(dateStr);

    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}
