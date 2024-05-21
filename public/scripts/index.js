document.getElementById('daily-report').addEventListener('click', async (e) => {
    getReport('/get-daliy-report');
    document.getElementById('report-title').innerText = "Today";
});

document.getElementById('weekly-report').addEventListener('click', async (e) => {
    getReport('/get-weekly-report');
    document.getElementById('report-title').innerText = "This Week";
});

document.getElementById('monthly-report').addEventListener('click', async (e) => {
    getReport('/get-monthly-report');
    document.getElementById('report-title').innerText = "This Month";
});

const getReport = async (url) => {
    try {
        const response = await axios.get(url);
        const data = await response.data;

        const totalExpenses = data.totalExpenses;
        const totalIncome = data.totalIncome;

        const expenses = data.expenses;
        const incomes = data.incomes;

        const report = getCombinedArray(incomes, expenses);
        setDataToUI(totalExpenses, totalIncome, report);
    } catch (error) {
        console.log(error);
    }
}


function getCombinedArray(incomes, expenses) {
    const combinedArray = [...incomes, ...expenses];

    const combinedArrayWithType = combinedArray.map(item => {
        if (item.hasOwnProperty('incomeAmount')) {
            return { ...item, type: 'income' };
        } else if (item.hasOwnProperty('expenseAmount')) {
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

async function setDataToUI(totalExpenses, totalIncome, report) {
    try {
        let html = "";
        report.forEach((element) => {
            if (element.type === 'income') {
                let date = convertedDate(element.createdAt);
                html += `<tr>
                <td>${date}</td>
                <td>${element.incomeCategory}</td>
                <td>${element.incomeDescription}</td>
                <td class='text-end'>${element.incomeAmount.toLocaleString()}</td>
                <td></td>
            </tr>`
            }
            else {
                let date = convertedDate(element.createdAt);
                html += `<tr>
                <td>${date}</td>
                <td>${element.expenseCategory}</td>
                <td>${element.expenseDescription}</td>
                <td></td>
                <td class='text-end'>${element.expenseAmount.toLocaleString()}</td>
            </tr>`
            }

        });

        html += `<tr>
                <td></td>
                <td></td>
                <td></td>
                <td class='text-success fw-bold text-end'>${totalIncome.toLocaleString()}</td>
                <td class='text-danger fw-bold text-end'>${totalExpenses.toLocaleString()}</td>
            </tr>`

        document.getElementById('report').innerHTML = html;
    } catch (error) {
        console.log(error);
        alert("Something went wrong");
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
    document.getElementById('report-title').innerText = "Today";
    const response = await axios.get('/premium-status');
    const data = await response.data;
    if (data.premium) {
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
        }
    }
    else {
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