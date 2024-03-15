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
                const now = new Date();
                const expirationDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                document.cookie = `token=${data.token}; expires; ${expirationDate.toUTCString()}`;
                document.cookie = `username=${data.name}; expires; ${expirationDate.toUTCString()}`;
                window.location.href = '/';
            }
        }

    } catch (error) {
        console.log(error);
        setMessage("Email must be Unique, something went wrong");
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
