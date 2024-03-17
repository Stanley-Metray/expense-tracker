document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('/password/forgotpassword', new FormData(e.target), {
            headers: {
                'Content-Type': 'application/json'
            }
        });


        if (response.status === 200) {
            const data = await response.data;
            setMessage(data.message);
        }
    } catch (error) {
        console.log(error);
        setMessage(await error.response.data);
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