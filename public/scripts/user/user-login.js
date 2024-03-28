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

        if (status === 200) {
            const now = new Date();
            const expirationDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            document.cookie = `token=${data.token}; expires=${expirationDate.toUTCString()}`;
            document.cookie = `username=${data.name}; expires=${expirationDate.toUTCString()}`;
            window.location.href = '/';
        }

    } catch (error) {
        console.log(error);
        const data = await error.response.data;
        setMessage(data);
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
