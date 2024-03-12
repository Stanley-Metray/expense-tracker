document.getElementById('registration-form').addEventListener('submit', async (e) => {
    try {
        e.preventDefault();
        const formData = new FormData(e.target);
            
        if (formData.get('password') !== formData.get('password2'))
            setMessage("Passwords are not matching");
        else {
            delete formData.password2;
            const response = await axios.post('/register', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const status = response.status;
            const data = await response.data;
            if (status === 201) {
                localStorage.setItem('username', data.name);
                localStorage.setItem('token', data.token);
                window.location.href = `/?token=${data.token}`;
            }
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
