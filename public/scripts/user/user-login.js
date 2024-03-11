document.getElementById('login-form').addEventListener('submit', async (e) => {
    try {
        e.preventDefault();
        const response = await axios.post('/login', new FormData(e.target), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const status = response.status;
        const data = await response.data;
        if(status===200)
        {
            localStorage.setItem('username', data.name);
            localStorage.setItem('id', data.id);
            window.location.href = '/';
        }

    } catch (error) {
        setMessage(error.response.data);
    }
});


function setMessage(mes) {
    const messageElement = document.getElementById('message');
    messageElement.innerText = `${mes}`;
    messageElement.style.display = 'block';

    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 4000);
}
