if(localStorage.getItem('username')===null)
    window.location.href ='/login';
else
{
    document.getElementById('username').innerText = localStorage.getItem('username');
}