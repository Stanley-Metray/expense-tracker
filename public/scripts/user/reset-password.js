document.getElementById('reset-password-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;

    if(password!==password2)
        return setMessage("Both Password Must Be Same");
    try{
        const id = window.location.href.split('/').pop();
        const formData = {
            id : id,
            password : password
        }

        const response = await axios.post('/password/reset-password', formData, {
            'Content-Type' : 'application/json'
        });

        if(response.status===200)
        {
            const data = await response.data;
            if(response.status===200)
            setMessage(data);
            setTimeout(()=>{
                window.location.href = '/login';
            }, 3000);
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