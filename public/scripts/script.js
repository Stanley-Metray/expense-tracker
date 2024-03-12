document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    

    document.getElementById('getExpense').addEventListener('click', async (e) => {

        if (token) {
            e.target.href = `/expense?token=${token}`;
        }
    });

    document.getElementById('getIncome').addEventListener('click', async (e) => {

        if (token) {
            e.target.href = `/income?token=${token}`;
        }
    });

    document.getElementById('getHome').addEventListener('click', async (e) => {
        if (token) {
            window.location.replace(`/?token=${token}`);
        }
    });
})



const username = localStorage.getItem('username');
if (username)
    document.getElementById('username').innerText = username;

