document.getElementById('forgot-password-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const response = await axios.post('/password/forgotpassword', {
        headers : {
            'Content-Type' : 'application/json'
        }
    });

    console.log(response);
});